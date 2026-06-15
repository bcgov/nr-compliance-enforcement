"""Config loading/validation and source resolution (file reads + URL fetches).

The "input side" of the parser: turn ``config.yaml`` into a :class:`~rb_model.Config`, and
turn each :class:`~rb_model.Source` into the raw markdown it points at (local file, or a
cached URL fetch).
"""

from __future__ import annotations

import datetime
import hashlib
import os
import re
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Optional

import yaml

from rb_log import RunbookError, die, warn
from rb_model import Config, Runbook, Source


# --------------------------------------------------------------------------------------
# Load / validate
# --------------------------------------------------------------------------------------


def repo_root_for(config_path: Path) -> Path:
    """Find the repo root without git: the nearest ancestor containing a ``tools/`` dir."""
    cur = config_path.resolve().parent
    for parent in [cur, *cur.parents]:
        if (parent / "tools").is_dir():
            return parent
    return config_path.resolve().parent


def validate_config(data: Any) -> list[str]:
    """Return a list of human-readable problems (empty = valid). Collects all, not just the first."""
    errors: list[str] = []
    if not isinstance(data, dict):
        return ["top level is not a mapping"]
    if data.get("kind") != "RunbookParser":
        errors.append(f"kind must be 'RunbookParser' (got {data.get('kind')!r})")
    spec = data.get("spec")
    if not isinstance(spec, dict):
        return errors + ["missing 'spec' mapping"]
    for key in ("root", "destination"):
        if not spec.get(key):
            errors.append(f"spec.{key} is required")
    names = set()
    for i, s in enumerate(spec.get("sources") or []):
        if not isinstance(s, dict) or not s.get("name"):
            errors.append(f"spec.sources[{i}] needs a name")
            continue
        names.add(s["name"])
        if s.get("url") and s.get("file"):
            errors.append(f"source '{s['name']}' sets both url and file; pick one")
    for i, r in enumerate(spec.get("runbooks") or []):
        for g in (r.get("snippets_from") or []):
            if g not in names:
                errors.append(f"runbook '{r.get('name', i)}' references unknown group '{g}'")
    return errors


def load_config(path: Path) -> Config:
    """Read, validate and resolve ``config.yaml`` into a :class:`~rb_model.Config`.

    Paths in ``spec`` (``root``/``destination``) are anchored at the repo root;
    ``working_dir`` honours the ``RUNBOOK_PARSER_CACHE`` env override. Exits via
    :func:`~rb_log.die` on a missing file or validation errors.
    """
    if not path.is_file():
        die(f"config not found: {path}")
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    errors = validate_config(data)
    if errors:
        die("invalid config:\n  - " + "\n  - ".join(errors))

    repo_root = repo_root_for(path)
    spec = data["spec"]
    sources = [
        Source(
            name=s.get("name", ""),
            description=s.get("description", "") or "",
            doc=s.get("doc"),
            url=s.get("url"),
            file=s.get("file"),
            index=i,
        )
        for i, s in enumerate(spec.get("sources") or [])
    ]
    runbooks = [
        Runbook(name=r.get("name", ""), snippets_from=list(r.get("snippets_from") or []))
        for r in (spec.get("runbooks") or [])
    ]
    return Config(
        path=path,
        repo_root=repo_root,
        kind=data.get("kind", ""),
        root=repo_root / spec["root"],
        destination=repo_root / spec["destination"],
        working_dir=Path(os.environ.get("RUNBOOK_PARSER_CACHE", spec.get("working_dir", "/tmp"))),
        sources=sources,
        runbooks=runbooks,
        status=data.get("status") or {},
    )


# --------------------------------------------------------------------------------------
# Source resolution + fetching
# --------------------------------------------------------------------------------------


def normalize_github_url(url: str) -> str:
    """Rewrite GitHub ``blob``/``wiki`` page URLs to their raw form; pass others through."""
    m = re.match(r"https?://github\.com/([^/]+)/([^/]+)/blob/(.+)", url)
    if m:
        return f"https://raw.githubusercontent.com/{m.group(1)}/{m.group(2)}/{m.group(3).split('#')[0]}"
    m = re.match(r"https?://github\.com/([^/]+)/([^/]+)/wiki/([^/#?]+)", url)
    if m:
        return f"https://raw.githubusercontent.com/wiki/{m.group(1)}/{m.group(2)}/{m.group(3)}.md"
    return url


def _cache_path(cfg: Config, url: str) -> Path:
    """Deterministic cache filename for a URL under ``working_dir``."""
    h = hashlib.sha1(url.encode()).hexdigest()[:12]
    slug = re.sub(r"[^a-z0-9]+", "-", url.split("/")[-1].lower()).strip("-")[:40]
    return cfg.working_dir / f"runbook-parser-{h}-{slug}.cache"


def fetch_url(cfg: Config, url: str, offline: bool) -> str:
    """Fetch a URL (normalized to raw), caching into ``working_dir``.

    Falls back to the cache on a network failure; with ``offline`` the network is never
    touched and a missing cache is a hard error.
    """
    cache = _cache_path(cfg, url)
    if offline:
        if cache.is_file():
            return cache.read_text(encoding="utf-8")
        raise RunbookError(
            f"--offline and no cache for {url}\n"
            f"  run once online to populate {cache}, or use a local file: source"
        )
    target = normalize_github_url(url)
    try:
        req = urllib.request.Request(target, headers={"User-Agent": "runbook-parser"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
        cfg.working_dir.mkdir(parents=True, exist_ok=True)
        cache.write_text(body, encoding="utf-8")
        return body
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        if cache.is_file():
            warn(f"  fetch failed for {url} ({e}); serving cached copy")
            return cache.read_text(encoding="utf-8")
        raise RunbookError(f"cannot fetch {url} ({e}) and no cache at {cache}")


def resolve_source(cfg: Config, src: Source, offline: bool) -> Optional[str]:
    """Return the raw markdown for a source, or ``None`` for a placeholder (no url/file)."""
    kind = src.kind()
    if kind == "file":
        p = cfg.repo_root / src.file
        if not p.is_file():
            raise RunbookError(f"source '{src.name}' file not found: {p}")
        return p.read_text(encoding="utf-8")
    if kind == "url":
        return fetch_url(cfg, src.url, offline)
    return None


def source_timestamp(cfg: Config, src: Source) -> Optional[str]:
    """Best-effort last-modified for a source (file mtime; URLs omitted — no git)."""
    if src.kind() == "file":
        p = cfg.repo_root / src.file
        if p.is_file():
            ts = datetime.datetime.fromtimestamp(p.stat().st_mtime, datetime.timezone.utc)
            return ts.strftime("%Y-%m-%dT%H:%M:%SZ")
    return None
