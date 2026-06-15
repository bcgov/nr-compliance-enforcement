#!/usr/bin/env python3
# parser.py — RunbookParser: tangle code out of prose runbooks into version-controlled
# snippets, recombine them into composable workflows, and detect doc/code drift.
#
# Setup Instructions:
#   1. Ensure Python 3.9+ is installed and on PATH.
#   2. Install dependencies (runs locally / in CI, not in the n8n container):
#        pip install pyyaml markdown-it-py
#   3. Run from the repo root, e.g.:
#        python tools/n8n/skills/runbook-parser/scripts/parser.py build
#
# It reads a `RunbookParser` config (default tools/n8n/config.yaml), decomposes each source
# document into ordered, typed Tier-1 snippets under `destination/<group>/`, assembles
# `runbooks` into tools/n8n/workflows/<name>.{md,sh}, and records the snippet inventory +
# drift state into the config's machine-owned `status:` block (the `spec:` block is
# read-only and never rewritten, so its comments are preserved).
#
# Commands:
#   build      doc -> Tier-1 snippets + workflows + status      (default)
#   check      regenerate doc from snippets, diff vs source/doc (read-only; exit 2 = drift)
#   scaffold   copy a Tier-1 snippet to a snippet_<section> stub (+ list inline-code candidates)
#   sync       reverse: recombine Tier-1 -> write the source doc/file (no-op when identical)
#
# This file is the CLI entry point; the implementation lives in the sibling rb_*.py modules
# (rb_markdown, rb_model, rb_config, rb_reconstruct, rb_commands, rb_log).
# See ../SKILL.md and ../references/ for the full model.

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path
from typing import Optional

# Ensure the sibling rb_*.py modules import cleanly regardless of the working directory.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import rb_commands  # noqa: E402
from rb_config import load_config  # noqa: E402
from rb_log import RunbookError, die, set_quiet  # noqa: E402

_COMMANDS = {
    "build": rb_commands.cmd_build,
    "check": rb_commands.cmd_check,
    "scaffold": rb_commands.cmd_scaffold,
    "sync": rb_commands.cmd_sync,
}


def parse_args(argv: Optional[list[str]]) -> argparse.Namespace:
    """Define and parse the CLI: a single command plus global flags."""
    default_config = "tools/n8n/config.yaml"
    parser = argparse.ArgumentParser(
        prog="parser.py",
        description="RunbookParser — decompose runbook docs into composable snippets.",
    )
    parser.add_argument("--config", default=default_config, help=f"config path (default {default_config})")
    parser.add_argument("--source", action="append", help="limit to this source group name (repeatable)")
    parser.add_argument(
        "--index", action="append", type=int, metavar="N",
        help="limit to spec.sources[N], 0-based (repeatable) — a partial build scoped to that source",
    )
    parser.add_argument("--dry-run", action="store_true", help="show actions without writing")
    parser.add_argument("--offline", action="store_true", help="never hit the network; require cache")
    parser.add_argument("-q", "--quiet", action="store_true", help="suppress progress output")
    parser.add_argument(
        "command",
        nargs="?",
        default="build",
        choices=list(_COMMANDS),
        help="build (default) | check | scaffold | sync",
    )
    return parser.parse_args(argv)


def main(argv: Optional[list[str]] = None) -> int:
    """Entry point: parse args, load the config, and dispatch to the chosen command."""
    args = parse_args(argv)
    set_quiet(args.quiet)
    cfg = load_config(Path(args.config))
    try:
        return _COMMANDS[args.command](cfg, args)
    except RunbookError as e:
        die(str(e))
    return 0


if __name__ == "__main__":
    sys.exit(main())
