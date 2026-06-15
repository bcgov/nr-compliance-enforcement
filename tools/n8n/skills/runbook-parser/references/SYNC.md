# Reverse sync — backport a snippet fix to the doc

The forward flow is `doc -> Tier 1 -> Tier 2`. The reverse flow exists to **reduce dev
burden**: when someone fixes a `snippet_*` (or a Tier-1 snippet) directly, the fix should
flow back to the source document instead of being hand-copied. That keeps the doc canonical
and resolves drift at the source.

```
edit Tier 2 (snippet_*)
   │  agent: reflect the substantive change into the matching Tier-1 snippet (judgement)
   ▼
Tier 1 (<srcdoc>_<section>.*)
   │  parser.py sync   (deterministic: recombine Tier 1 -> write the doc)
   ▼
source doc / file
   │  parser.py check  (confirm in_sync)
   ▼
commit
```

## Why two hops

- **Tier 2 -> Tier 1 is judgement** and stays with the agent: a Tier-2 block is
  parameterized, guarded, and JSON-emitting, so only the *substantive* part of a fix (a
  corrected selector, flag, path, or command) maps back to the plain Tier-1 form. The
  scaffolding (param parsing, `set -euo pipefail`, `jq` shaping) does **not** belong in the
  doc.
- **Tier 1 -> doc is deterministic** and is what `parser.py sync` does: Tier-1 snippets are
  a lossless decomposition, so recombining them reproduces the document. `sync` writes that
  reconstruction back to the target.

## Running it

```bash
P="python tools/n8n/skills/runbook-parser/scripts/parser.py"
# 1. reflect the fix into the Tier-1 snippet (edit the <srcdoc>_<section>.* file)
$P sync   --source <group>     # writes the doc/file from Tier 1
$P check  --source <group>     # expect in_sync (exit 0)
```

- `sync` writes **byte-faithfully**, so the resulting diff shows only the change you made —
  not reformatting. A no-op `sync` reports "already in sync" and writes nothing.
- `sync --dry-run` prints the unified diff without writing.

## Targets

- **`file:` source** (or `doc:` set) — `sync` writes that local file. This is the normal
  backport: the local runbook/doc is updated in place.
- **`url:` source with no local `doc:`** — a remote wiki cannot be pushed to, so `sync`
  prints the diff and writes nothing. Add a `doc:` to mirror the wiki locally if you want
  `sync` to maintain a committed copy; otherwise paste the diff into the wiki by hand.

## Guardrails

- Never edit the doc *and* the snippet separately — pick one source of truth and let `sync`
  or `build` propagate. Editing both invites a merge you have to reconcile.
- Run `check` after `sync` and after any Tier-1 edit; commit only at exit 0.
- If a Tier-2 fix touches logic that only exists in Tier 2 (param handling, output shaping),
  there is nothing to backport — the doc documents the *operation*, not the plumbing.
