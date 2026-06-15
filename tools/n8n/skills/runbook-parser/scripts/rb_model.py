"""Domain dataclasses and the text-to-snippets bridge.

:class:`Source`/:class:`Runbook`/:class:`Config` mirror the config's ``spec``;
:class:`Snippet` is one Tier-1 chunk on disk. :func:`extract_snippets` turns a resolved
source document into an ordered, uniquely-named list of :class:`Snippet`.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

import rb_markdown


@dataclass
class Source:
    """One ``spec.sources[]`` entry. Set exactly one of ``url``/``file``; neither = placeholder."""

    name: str
    description: str = ""
    doc: Optional[str] = None
    url: Optional[str] = None
    file: Optional[str] = None
    index: int = 0

    def kind(self) -> str:
        """Resolution discriminator: ``"file"``, ``"url"`` or ``"none"`` (placeholder)."""
        if self.file:
            return "file"
        if self.url:
            return "url"
        return "none"

    def docname(self) -> str:
        """Slug used as the filename prefix for this source's snippets."""
        if self.file:
            return rb_markdown.slugify(Path(self.file).stem)
        if self.url:
            seg = self.url.rstrip("/").split("/")[-1]
            return rb_markdown.slugify(re.sub(r"\.[A-Za-z0-9]+$", "", seg))
        return rb_markdown.slugify(self.name)


@dataclass
class Snippet:
    """A single Tier-1 chunk: its filename, language, source provenance and ordering."""

    id: str
    file: str
    ext: str
    lang: str
    fence_info: Optional[str]
    section: Optional[str]
    order: int
    content: str
    source_index: int
    source_ref: str
    line: int

    def is_prose(self) -> bool:
        """True for a prose (``.md``) chunk, as opposed to an extracted code block."""
        return self.ext == "md" and self.fence_info is None


@dataclass
class Runbook:
    """One ``spec.runbooks[]`` entry — a named recombination of one or more groups."""

    name: str
    snippets_from: list[str] = field(default_factory=list)


@dataclass
class Config:
    """The loaded config: resolved paths, parsed ``spec`` lists, and the raw ``status`` dict."""

    path: Path
    repo_root: Path
    kind: str
    root: Path
    destination: Path
    working_dir: Path
    sources: list[Source]
    runbooks: list[Runbook]
    status: dict


def extract_snippets(src: Source, body: str) -> list[Snippet]:
    """Decompose ``body`` into Tier-1 snippets for ``src``.

    Each chunk becomes a ``<docname>_<section>.<ext>`` file; collisions within the source
    (same section + extension) get a ``-2``/``-3`` suffix. ``order`` is the in-source index;
    the caller offsets it per source so merged groups stay deterministically ordered.
    """
    snippets: list[Snippet] = []
    used: set[str] = set()
    docname = src.docname()
    for order, ch in enumerate(rb_markdown.decompose(body)):
        if ch.kind == "prose":
            ext, lang, info = "md", "md", None
        else:
            lang = rb_markdown.language_for(ch.info)
            ext, info = lang, ch.info
        base = f"{docname}_{rb_markdown.slugify(ch.section or 'intro')}"
        stem, n = base, 1
        while f"{stem}.{ext}" in used:
            n += 1
            stem = f"{base}-{n}"
        used.add(f"{stem}.{ext}")
        snippets.append(
            Snippet(
                id=stem,
                file=f"{stem}.{ext}",
                ext=ext,
                lang=lang,
                fence_info=info,
                section=ch.section,
                order=order,
                content=ch.text,
                source_index=src.index,
                source_ref=src.file or src.url or src.name,
                line=ch.line,
            )
        )
    return snippets
