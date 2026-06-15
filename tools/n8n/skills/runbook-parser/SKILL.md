---
name: runbook-parser
description: Tangle code out of prose runbooks and wikis into version-controlled snippets, recombine them into composable n8n workflows, and detect doc/code drift. Use it to author or extend a RunbookParser config.yaml, run the parser (build, check, scaffold, sync), promote raw snippets into safe parameterized building blocks, or backport a snippet fix to the source doc.
owner: Compliance and Enforcement
tags: [n8n, runbook, parser, drift, docs-as-code]
---

# Runbook Parser

Turns operational runbook documents (wiki pages, markdown like `crunchy-notes.md`)
into a version-controlled, composable library of building blocks for n8n workflows, and
keeps the extracted code in sync with its source — in both directions.

Two tiers of snippets:

- **Tier 1 (raw)** — the parser losslessly decomposes a source doc into ordered, typed
  snippets named `srcdoc_section.ext` (prose to `.md`, fenced blocks to `.sh`/`.yaml`/
  `.sql`/…). Recombining them reproduces the doc, which powers drift detection and `sync`.
- **Tier 2 (adjusted)** — you (the agent) rewrite chosen Tier-1 snippets into `snippet_*`
  building blocks that are individually runnable, parameterized, read-only and idempotent.

`config.yaml` is the single manifest, shaped like a CRD: `spec:` is human-authored,
`status:` is machine-owned and written back by the parser. The tool is a small Python
package at `scripts/parser.py` (requires PyYAML and markdown-it-py); the markdown templating
helper is `tools/n8n/render.sh`.

## Use When

- Authoring or extending a `RunbookParser` `config.yaml` (new sources, runbooks, merging
  same-name groups). See `references/CONFIG.md`.
- Pulling a wiki or markdown runbook into committed snippets under `snippets/`.
- Promoting raw Tier-1 snippets into safe, parameterized Tier-2 `snippet_*` blocks.
- Assembling a runbook into `tools/n8n/workflows/` for n8n to run.
- Checking drift between docs and extracted code (local or CI).
- Backporting a Tier-2 fix to the source doc (Tier 2, then Tier 1, then `sync`).
- Running the parser against another team's repo (each repo has its own config).

## Don't Use When

- Pushing or pulling the n8n workflow JSON itself, use `tools/n8n/pull.sh` / `push.sh`.
- Hand-editing generated Tier-1 snippets, edit the source doc and re-run `build` instead
  (the parser prunes and overwrites them).
- Plain markdown authoring with no extraction, drift, or composition need.

## Workflow

Forward (doc to snippets to workflow):

1. Locate or scaffold `config.yaml`; confirm `root`, `destination`, `working_dir`.
2. For each source set exactly one of `url:` / `file:`, a `description`, and an optional
   `doc:`; group related sources by a shared `name`.
3. `python scripts/parser.py build --dry-run` — review the planned files.
4. `python scripts/parser.py build` — writes Tier-1 snippets, workflows, and `status`.
5. `python scripts/parser.py check` — gate on exit 2 (drift) before committing.
6. Promote building blocks: `python scripts/parser.py scaffold` to stub `snippet_*` files
   (and surface inline-code candidates), then for each one follow `references/ADJUSTMENT.md`
   — rewrite to the contract, run the available linter (`shellcheck` for sh), and if it
   cannot be made read-only and idempotent, drop it and record `tier2: dropped` plus a
   reason in `status`.
7. Commit `snippets/` and `workflows/`.

Reverse (sync a fix back, to reduce dev burden):

1. A dev improves a `snippet_*`; reflect the substantive change into the matching Tier-1
   snippet (judgement).
2. `python scripts/parser.py sync` recombines Tier 1 and writes the source doc.
3. `python scripts/parser.py check` confirms in-sync. See `references/SYNC.md`.

## Rules

- Always run `build` then `check` before committing; never commit with `check` at exit 2.
- Always set exactly one of `url:` / `file:` per source (Why: a source with neither is a
  placeholder that yields no snippets).
- Never hand-edit Tier-1 snippets or the parser-owned `status` fields — they are
  regenerated (Why: `build` prunes and overwrites them).
- Never promote a mutating or non-idempotent snippet; drop it and record why (Why: Tier-2
  blocks must be safe to re-run in any order an n8n workflow composes them).
- Account for inline code (backtick spans) in the `.md` snippets when adjusting, not just
  fenced blocks.
- Prefer processable output; use JSON via `jq` for verbose or structured data, plain
  stdout otherwise — use judgement.
- Run the language-appropriate linter on every Tier-2 snippet you produce.
- Backport with `sync` so the doc stays canonical; never edit the doc and the snippet
  separately.
- Keep the `working_dir` fetch cache out of commits.
- The parser needs `pip install pyyaml markdown-it-py` (runs locally or in CI, not in n8n).

## Examples

- "Pull the crunchy DR commands from the wiki into snippets" then set the source `url:` and
  run `build`.
- "Has our runbook drifted from the docs?" then run `check` and read the unified diff.
- "Add the postgres triage snippets to the same group" then add a same-`name` source and
  re-run `build` (auto-merged).
- "Make a composable cluster-status block" then `scaffold`, adjust to the contract, and run
  `shellcheck`.
- "I fixed the pod selector in the snippet, update the doc" then reflect it into Tier 1 and
  run `sync`.
- "Show three chained results to the user" then write a markdown `snippet_*` with
  `{{ .json.path }}` and render it with `render.sh`.

## Edge Cases

- Source URL unreachable then the parser serves the `working_dir` cache; `--offline`
  forces cache-only.
- A `doc:` file that does not exist yet then `check` reports `doc_missing` and `sync`
  creates it (it is not an error).
- Same `name` across sources then snippets merge deterministically in config order.
- A source with neither `url` nor `file` then it is a placeholder contributing nothing.
- A null timestamp then the drift check still runs (null never suppresses it).
- Reverse `sync` into a `url:` source then the local `doc` mirror is written and a diff is
  printed for manual wiki update (a remote wiki cannot be pushed to).

## References

- `references/CONFIG.md` — every `spec`/`status` field, the merge rule, and the drift
  round-trip model.
- `references/PARSER_USAGE.md` — CLI, subcommands, exit codes, cache and `--offline`, URL
  normalization, and a no-network smoke test.
- `references/ADJUSTMENT.md` — the Tier-2 contract: safety/idempotency/parameterization
  rules, inline-code harvest, linters, and the `render.sh` placeholder syntax.
- `references/SYNC.md` — the reverse flow (Tier 2 to Tier 1 to doc) and the `sync` handoff.
- `references/SKILL_SPEC.md` — the SKILL.md manifest spec this file conforms to.
