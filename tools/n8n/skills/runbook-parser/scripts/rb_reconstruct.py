"""Snippet -> document reconstruction, and the drift comparison built on it.

Because :func:`~rb_markdown.decompose` is lossless, concatenating a source's snippets in
order reproduces the document. :func:`render_from_disk` does that from the committed files
(what ``check``/``sync`` compare against), while :func:`render_from_snippets` does it from
in-memory snippets (used during ``build``).
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from rb_model import Config, Snippet, Source


def _eol(text: str) -> str:
    """Normalize line endings only — used by ``sync`` so writes stay byte-faithful."""
    return text.replace("\r\n", "\n")


def normalize(text: str) -> str:
    """Lenient normalization for drift checks: strip trailing whitespace and final newline.

    Keeps cosmetic edits (trailing spaces, a missing final newline) from registering as
    drift. ``sync`` deliberately does NOT use this — it writes the faithful reconstruction.
    """
    body = "\n".join(line.rstrip() for line in _eol(text).split("\n"))
    return body.strip("\n") + "\n"


def _read_snippet_content(path: Path) -> str:
    """Read a snippet file, stripping the single trailing newline the writer added."""
    c = path.read_text(encoding="utf-8")
    return c[:-1] if c.endswith("\n") else c


def render_from_snippets(snippets: list[Snippet]) -> str:
    """Reconstruct a document from in-memory snippets (prose verbatim, code re-fenced)."""
    parts: list[str] = []
    for s in sorted(snippets, key=lambda x: x.order):
        if s.is_prose():
            parts.append(s.content)
        else:
            parts.append(f"```{s.fence_info or ''}\n{s.content}\n```")
    return "\n".join(parts)


def render_from_disk(cfg: Config, group: str, metas: list[dict]) -> str:
    """Reconstruct a document from the committed snippet files, ordered by ``status``.

    ``metas`` are the ``status`` snippet entries for one source; each carries the file name,
    ordering and original fence info needed to rebuild the document faithfully.
    """
    parts: list[str] = []
    group_dir = cfg.destination / group
    for s in sorted(metas, key=lambda x: x.get("order", 0)):
        content = _read_snippet_content(group_dir / s["file"])
        if s.get("fence_info") is None and s["file"].endswith(".md"):
            parts.append(content)
        else:
            parts.append(f"```{s.get('fence_info') or ''}\n{content}\n```")
    return "\n".join(parts)


def load_doc_target(cfg: Config, src: Source) -> Optional[str]:
    """The text a source is compared against: its ``doc`` file, else the source itself."""
    if src.doc:
        p = cfg.root / src.doc
        return p.read_text(encoding="utf-8") if p.is_file() else None
    if src.kind() == "file":
        p = cfg.repo_root / src.file
        return p.read_text(encoding="utf-8") if p.is_file() else None
    return None


def drift_state(cfg: Config, src: Source, snippets: list[Snippet]) -> str:
    """Classify a source as ``in_sync`` / ``drifted`` / ``doc_missing`` / ``n/a``."""
    target = load_doc_target(cfg, src)
    if target is None:
        return "doc_missing" if src.doc else "n/a"
    generated = render_from_snippets(snippets)
    return "in_sync" if normalize(generated) == normalize(target) else "drifted"
