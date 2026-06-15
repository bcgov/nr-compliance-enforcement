"""The four subcommands and their helpers (the orchestration layer).

* :func:`cmd_build` — sources -> Tier-1 snippets + workflows + ``status``.
* :func:`cmd_check` — drift detection (read-only; exit 2 on drift).
* :func:`cmd_sync` — reverse: recombine Tier-1 and write the source doc.
* :func:`cmd_scaffold` — stub ``snippet_*`` files and list inline-code candidates.

Status write-back replaces only the machine-owned ``status:`` block (from its marker to
end-of-file), leaving the commented ``spec`` untouched, and preserves agent-set ``tier2``
annotations across rebuilds.
"""

from __future__ import annotations

import difflib
import re
import sys
from typing import Any, Optional

import yaml

import rb_markdown
from rb_config import resolve_source, source_timestamp
from rb_log import RunbookError, info, warn
from rb_model import Config, Snippet, Source, extract_snippets
from rb_reconstruct import (
    _eol,
    _read_snippet_content,
    drift_state,
    load_doc_target,
    normalize,
    render_from_disk,
    render_from_snippets,
)


# --------------------------------------------------------------------------------------
# Selection helpers
# --------------------------------------------------------------------------------------


def select_sources(cfg: Config, names: list[str], indices: Optional[list[int]] = None) -> list[Source]:
    """Sources to act on, filtered by ``--source`` group names and/or ``--index`` positions."""
    out = [s for s in cfg.sources if not names or s.name in names]
    if indices:
        out = [s for s in out if s.index in indices]
    return out


def group_order(cfg: Config) -> list[str]:
    """Group names in first-seen config order (sources sharing a name merge into one)."""
    seen: list[str] = []
    for s in cfg.sources:
        if s.name not in seen:
            seen.append(s.name)
    return seen


def source_metas(cfg: Config, src: Source) -> list[dict]:
    """The ``status`` snippet entries belonging to one source (matched by provenance ref)."""
    group_meta = (cfg.status.get("groups") or {}).get(src.name, {})
    ref = src.file or src.url
    return [m for m in (group_meta.get("snippets") or []) if m.get("provenance", {}).get("ref") == ref]


# --------------------------------------------------------------------------------------
# build
# --------------------------------------------------------------------------------------


def cmd_build(cfg: Config, args) -> int:
    """Resolve sources, extract snippets, write files + workflows, and rewrite ``status``.

    With ``--source``/``--index`` this becomes a *partial* build: only the selected sources
    are fetched and written; pruning and ``status`` are scoped to them (other sources' files
    and status entries are left intact), and workflow recomposition is skipped (it needs the
    whole group — run a full build to refresh workflows).
    """
    selected = select_sources(cfg, args.source or [], args.index)
    partial = bool(args.source) or bool(args.index)
    tier2 = existing_tier2(cfg)
    groups: dict[str, list[Snippet]] = {g: [] for g in group_order(cfg)}
    source_status: dict[str, list[dict]] = {g: [] for g in group_order(cfg)}
    processed_refs: set[str] = set()
    processed_docnames: dict[str, set[str]] = {}

    failures = 0
    for src in selected:
        try:
            body = resolve_source(cfg, src, args.offline)
        except RunbookError as e:
            warn(f"  failed: source '{src.name}': {e}")
            failures += 1
            continue
        processed_refs.add(src.file or src.url or src.name)
        if body is None:
            info(f"  note: source '{src.name}' has no url/file — skipping (placeholder)")
            source_status[src.name].append({"ref": src.name, "kind": "none", "drift": "n/a"})
            continue
        snippets = extract_snippets(src, body)
        for s in snippets:
            s.order = src.index * 100000 + s.order  # merged groups: by source, then in-source
        groups[src.name].extend(snippets)
        processed_docnames.setdefault(src.name, set()).add(src.docname())
        source_status[src.name].append(
            {
                "ref": src.file or src.url,
                "kind": src.kind(),
                "source_last_updated": source_timestamp(cfg, src),
                "doc": src.doc,
                "drift": drift_state(cfg, src, snippets),
            }
        )
        info(f"  parsed: {src.name} <- {src.file or src.url} ({len(snippets)} snippet(s))")

    for gname in group_order(cfg):
        if partial and gname not in processed_docnames:
            continue
        write_group(cfg, gname, groups[gname], args.dry_run, processed_docnames.get(gname) if partial else None)

    if partial:
        info("  note: workflows not recomposed (partial build) — run a full build to refresh them")
    else:
        for rb in cfg.runbooks:
            assemble_workflow(cfg, rb, groups, args.dry_run)

    status = build_status(cfg, groups, source_status, tier2, processed_refs if partial else None)
    write_status(cfg, status, args.dry_run)

    if failures:
        warn(f"completed with {failures} source failure(s)")
        return 1
    return 0


def write_group(cfg: Config, group: str, snippets: list[Snippet], dry_run: bool, prune_docnames: Optional[set] = None) -> None:
    """Write a group's Tier-1 files and prune stale ones (never touches ``snippet_*``).

    ``prune_docnames`` (partial builds) scopes pruning to files whose source was processed
    this run — files from the ``<docname>_`` prefix of any other source are left alone.
    """
    group_dir = cfg.destination / group
    planned = {s.file: s.content + "\n" for s in snippets}
    if group_dir.is_dir():
        for existing in sorted(group_dir.glob("*")):
            if not existing.is_file() or existing.name.startswith("snippet_") or "_" not in existing.stem:
                continue  # never touch Tier-2 files, directories, or non-snippet files
            if prune_docnames is not None and existing.stem.split("_", 1)[0] not in prune_docnames:
                continue  # source not processed this run — leave its files alone
            if existing.name not in planned:
                if dry_run:
                    info(f"  [dry-run] would prune {group}/{existing.name}")
                else:
                    existing.unlink()
                    info(f"  pruned: {group}/{existing.name}")
    for fname, content in planned.items():
        path = group_dir / fname
        if path.is_file() and path.read_text(encoding="utf-8") == content:
            continue
        if dry_run:
            info(f"  [dry-run] would write {group}/{fname}")
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        info(f"  wrote: {group}/{fname}")


def assemble_workflow(cfg: Config, rb, groups: dict[str, list[Snippet]], dry_run: bool) -> None:
    """Recombine a runbook's groups into ``workflows/<name>.md`` (+ ``.sh`` when shell)."""
    collected: list[Snippet] = []
    for gname in rb.snippets_from:
        collected.extend(sorted(groups.get(gname, []), key=lambda x: x.order))
    if not collected:
        warn(f"  workflow '{rb.name}' has no snippets (groups: {rb.snippets_from})")
    md = (
        f"# {rb.name}\n\n"
        f"<!-- generated by parser.py from snippets_from: {', '.join(rb.snippets_from)} — do not edit by hand -->\n\n"
        f"{render_from_snippets(collected)}\n"
    )
    shell = [s for s in collected if s.lang == "sh"]
    workflows_dir = cfg.root / "workflows"
    _write_if_changed(workflows_dir / f"{rb_markdown.slugify(rb.name)}.md", md, dry_run)
    if shell:
        body = "#!/usr/bin/env bash\n# generated by parser.py — do not edit by hand\nset -euo pipefail\n\n"
        for s in shell:
            body += f"# --- {s.id} ({s.section or ''}) ---\n{s.content}\n\n"
        _write_if_changed(workflows_dir / f"{rb_markdown.slugify(rb.name)}.sh", body, dry_run)


def _write_if_changed(path, content: str, dry_run: bool) -> None:
    """Write ``content`` only when it differs from what is on disk (avoids needless churn)."""
    if path.is_file() and path.read_text(encoding="utf-8") == content:
        return
    if dry_run:
        info(f"  [dry-run] would write workflows/{path.name}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    info(f"  wrote: workflows/{path.name}")


# --------------------------------------------------------------------------------------
# status
# --------------------------------------------------------------------------------------


def existing_tier2(cfg: Config) -> dict[str, dict]:
    """Capture agent-set ``tier2``/``tier2_reason`` from the current status, keyed group/file."""
    out: dict[str, dict] = {}
    for gname, g in (cfg.status.get("groups") or {}).items():
        for s in g.get("snippets") or []:
            if s.get("tier2") not in (None, "pending") or s.get("tier2_reason"):
                out[f"{gname}/{s.get('file')}"] = {
                    "tier2": s.get("tier2"),
                    "tier2_reason": s.get("tier2_reason"),
                }
    return out


def build_status(cfg: Config, groups, source_status, tier2, processed_refs=None) -> dict:
    """Assemble the ``status`` dict, re-applying preserved ``tier2`` annotations.

    When ``processed_refs`` is given (partial build), existing entries for sources that were
    NOT processed this run are preserved; otherwise ``status`` is rebuilt fresh.
    """
    existing = (cfg.status.get("groups") or {}) if processed_refs is not None else {}
    out_groups: dict[str, Any] = {}
    for gname in group_order(cfg):
        fresh_snips = []
        for s in sorted(groups.get(gname, []), key=lambda x: x.order):
            entry = {
                "id": s.id,
                "file": s.file,
                "lang": s.lang,
                "section": s.section,
                "order": s.order,
                "fence_info": s.fence_info,
                "provenance": {"ref": s.source_ref, "line": s.line},
                "tier2": "pending",
            }
            saved = tier2.get(f"{gname}/{s.file}")
            if saved:
                entry["tier2"] = saved.get("tier2") or "pending"
                if saved.get("tier2_reason"):
                    entry["tier2_reason"] = saved["tier2_reason"]
            fresh_snips.append(entry)
        fresh_sources = source_status.get(gname, [])
        if processed_refs is not None:
            eg = existing.get(gname, {})
            kept_snips = [m for m in (eg.get("snippets") or []) if m.get("provenance", {}).get("ref") not in processed_refs]
            kept_sources = [s for s in (eg.get("sources") or []) if s.get("ref") not in processed_refs]
            snippets = sorted(kept_snips + fresh_snips, key=lambda m: m.get("order", 0))
            sources = kept_sources + fresh_sources
        else:
            snippets, sources = fresh_snips, fresh_sources
        out_groups[gname] = {"sources": sources, "snippets": snippets}
    return {"groups": out_groups}


def write_status(cfg: Config, status: dict, dry_run: bool) -> None:
    """Replace the config's ``status:`` block (marker to EOF), leaving ``spec`` byte-for-byte.

    Only the machine-owned ``status:`` block is re-emitted; the commented ``spec`` above the
    marker is preserved exactly, since PyYAML's load/dump would otherwise drop its comments.
    """
    lines = cfg.path.read_text(encoding="utf-8").split("\n")
    cut = next((i for i, ln in enumerate(lines) if re.match(r"^status\s*:", ln)), None)
    spec_part = "\n".join(lines[:cut]) if cut is not None else "\n".join(lines).rstrip("\n")
    if not spec_part.endswith("\n"):
        spec_part += "\n"
    block = yaml.safe_dump(
        {"status": status}, default_flow_style=False, sort_keys=False, width=10000, allow_unicode=True
    )
    if dry_run:
        info(f"  [dry-run] would rewrite status block ({len(status.get('groups', {}))} group(s))")
        return
    cfg.path.write_text(spec_part + block, encoding="utf-8")
    info("  wrote status block to config.yaml (spec untouched)")


# --------------------------------------------------------------------------------------
# check
# --------------------------------------------------------------------------------------


def cmd_check(cfg: Config, args) -> int:
    """Compare each source's reconstruction to its doc; print a diff and exit 2 on drift."""
    drift = 0
    for src in select_sources(cfg, args.source or [], args.index):
        if src.kind() == "none":
            continue
        metas = source_metas(cfg, src)
        if metas:
            generated = render_from_disk(cfg, src.name, metas)
        else:
            try:
                body = resolve_source(cfg, src, args.offline)
            except RunbookError as e:
                warn(f"  {src.name}: {e}")
                drift = max(drift, 1)
                continue
            if body is None:
                continue
            generated = render_from_snippets(extract_snippets(src, body))
        target = load_doc_target(cfg, src)
        if target is None:
            print(f"  {src.name}: doc_missing ({src.doc}) — would be created by sync")
            drift = max(drift, 2)
            continue
        if normalize(generated) == normalize(target):
            print(f"  {src.name}: in_sync")
        else:
            print(f"  {src.name}: DRIFTED")
            sys.stdout.writelines(
                difflib.unified_diff(
                    normalize(target).splitlines(keepends=True),
                    normalize(generated).splitlines(keepends=True),
                    fromfile=f"{src.name} (doc)",
                    tofile=f"{src.name} (from snippets)",
                )
            )
            drift = max(drift, 2)
    return drift


# --------------------------------------------------------------------------------------
# sync
# --------------------------------------------------------------------------------------


def cmd_sync(cfg: Config, args) -> int:
    """Recombine Tier-1 snippets and write the source doc (byte-faithful; no-op if equal)."""
    for src in select_sources(cfg, args.source or [], args.index):
        if src.kind() == "none":
            continue
        metas = source_metas(cfg, src)
        if not metas:
            warn(f"  {src.name}: no snippets in status — run build first")
            continue
        generated = _eol(render_from_disk(cfg, src.name, metas))
        if src.doc:
            target_path = cfg.root / src.doc
        elif src.kind() == "file":
            target_path = cfg.repo_root / src.file
        else:
            target_path = None
        current = target_path.read_text(encoding="utf-8") if target_path and target_path.is_file() else ""
        if target_path and _eol(current) == generated:
            print(f"  {src.name}: already in sync ({target_path.name})")
            continue
        if args.dry_run or target_path is None:
            if target_path is None:
                warn(f"  {src.name}: url source with no local doc — diff only (cannot push to a remote wiki)")
            sys.stdout.writelines(
                difflib.unified_diff(
                    _eol(current).splitlines(keepends=True),
                    generated.splitlines(keepends=True),
                    fromfile=str(target_path or src.url),
                    tofile="from snippets",
                )
            )
            continue
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(generated, encoding="utf-8")
        print(f"  {src.name}: wrote {target_path}")
    return 0


# --------------------------------------------------------------------------------------
# scaffold
# --------------------------------------------------------------------------------------


def cmd_scaffold(cfg: Config, args) -> int:
    """Stub ``snippet_*`` files from Tier-1 code, and surface inline-code candidates from prose."""
    for src in select_sources(cfg, args.source or [], args.index):
        metas = source_metas(cfg, src) or (cfg.status.get("groups") or {}).get(src.name, {}).get("snippets") or []
        if not metas:
            warn(f"  {src.name}: nothing to scaffold — run build first")
            continue
        group_dir = cfg.destination / src.name
        for m in metas:
            if m["file"].endswith(".md"):
                _report_inline_candidates(group_dir, m)
                continue
            # Stub name comes from the Tier-1 stem (minus the docname prefix) so multiple
            # blocks in one section keep their -N suffixes and don't collide.
            rest = m["id"].split("_", 1)[1] if "_" in m["id"] else rb_markdown.slugify(m.get("section") or m["id"])
            stub = group_dir / f"snippet_{rest}.{m['lang']}"
            if stub.exists():
                continue
            raw = _read_snippet_content(group_dir / m["file"])
            header = _stub_header(rest, m)
            if args.dry_run:
                info(f"  [dry-run] would scaffold {src.name}/{stub.name}")
                continue
            stub.write_text(header + raw + "\n", encoding="utf-8")
            info(f"  scaffolded: {src.name}/{stub.name}")
    return 0


def _report_inline_candidates(group_dir, m: dict) -> None:
    """Print inline backtick spans in a prose snippet that look like commands worth promoting."""
    content = _read_snippet_content(group_dir / m["file"])
    cmds = [
        c for c in re.findall(r"`([^`]+)`", content)
        if re.search(r"\b(oc|psql|pg_dump|patronictl|kubectl|jq|curl|helm)\b", c)
    ]
    if cmds:
        print(f"  inline-code candidates in {m['file']}:")
        for c in cmds:
            print(f"      {c}")


def _stub_header(rest: str, m: dict) -> str:
    """The header comment prepended to a scaffolded stub, pointing at the adjustment contract."""
    if m["lang"] == "sh":
        return (
            f"#!/usr/bin/env bash\n"
            f"# snippet_{rest} — adjust per references/ADJUSTMENT.md:\n"
            f"#   read-only + idempotent, parameterize via args/env, processable output.\n"
            f"# source: {m['file']}\n"
            f"set -euo pipefail\n\n"
        )
    return f"<!-- snippet_{rest}: display template; fill via render.sh ({{{{ .json.path }}}} / ${{VAR}}) -->\n\n"
