# parser.py — CLI reference

Python 3.9+ with PyYAML and markdown-it-py (`pip install pyyaml markdown-it-py`). Runs
locally or in CI (not inside the n8n container). Run from the repo root.

```
python tools/n8n/skills/runbook-parser/scripts/parser.py <command> [options]
```

## Commands

| Command            | Does                                                                       | Exit codes                  |
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
| `build` (default)  | resolve sources -> extract Tier-1 snippets -> write files -> assemble workflows -> write `status` | 0 ok / 1 a source failed    |
| `check`            | recombine snippets and diff against the source/doc; **read-only**          | 0 in-sync / 2 drift / 1 err |
| `scaffold`         | copy Tier-1 snippets to `snippet_<section>` stubs and list inline-code candidates | 0 / 1                |
| `sync`             | reverse: recombine Tier-1 and **write** the source doc/file (no-op when identical) | 0 / 1               |

`check` returns a distinct **2** for drift (vs **1** for a tool error) so CI can tell
"docs and code diverged" from "the run failed" — like `git diff --exit-code`.

## Options (all commands)

| Option            | Effect                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| `--config PATH`   | config path (default `tools/n8n/config.yaml`)                         |
| `--source NAME`   | limit to this source group; repeatable                               |
| `--index N`       | limit to `spec.sources[N]` (0-based); repeatable — a partial build   |
| `--dry-run`       | print intended writes/diffs without touching disk                    |
| `--offline`       | never hit the network; require a `working_dir` cache for url sources |
| `-q, --quiet`     | suppress progress output                                             |
| `-h, --help`      | argparse help                                                        |

## Partial builds (`--index` / `--source`)

Selecting a subset of sources makes `build` **partial** and non-destructive: only the chosen
sources are fetched and written, pruning and `status` are scoped to them (other sources'
files and status entries are left intact), and workflow recomposition is skipped (it needs
the whole group — run a full `build` to refresh `workflows/`). This is the way to iterate on
one source when several share a group `name`. Example — regenerate just the wiki source at
index 1:

```bash
python tools/n8n/skills/runbook-parser/scripts/parser.py build --index 1
```

## Cache and offline

- `url:` sources are fetched once and cached under `working_dir`
  (`runbook-parser-<hash>-<slug>.cache`). Override the location with the
  `RUNBOOK_PARSER_CACHE` environment variable (handy when `/tmp` is awkward locally).
- On a fetch failure the parser falls back to the cache with a warning. `--offline` skips
  the network entirely and errors if the cache is missing.

## URL normalization

- `https://github.com/OWNER/REPO/blob/REF/path` -> `https://raw.githubusercontent.com/OWNER/REPO/REF/path`
- `https://github.com/OWNER/REPO/wiki/Page` -> `https://raw.githubusercontent.com/wiki/OWNER/REPO/Page.md`
- anything else is fetched as-is.

## Snippet layout

```
snippets/<group>/
  <srcdoc>_<section>.md      # Tier-1 prose chunk
  <srcdoc>_<section>.sh      # Tier-1 code chunk (also .yaml/.sql/.json/.txt)
  snippet_<section>.sh       # Tier-2 adjusted block (you create these via scaffold + edit)
```

Names: `_` separates structural parts, `-` is kebab within a part. Multiple chunks in one
section get a `-2`, `-3` suffix. Recombination order is taken from `status`, not filename
sort, so names stay readable.

## No-network smoke test

Point a scratch config at a local file and exercise the whole loop without the network:

```bash
cat > /tmp/scratch.yaml <<'YAML'
kind: RunbookParser
metadata: { name: scratch }
spec:
  root: tools/n8n/
  destination: tools/n8n/_scratch_snippets/
  working_dir: /tmp
  sources:
    - { name: crunchy-triage, description: scratch, file: crunchy-notes.md }
  runbooks:
    - { name: crunchy-triage, snippets_from: [crunchy-triage] }
YAML
P="python tools/n8n/skills/runbook-parser/scripts/parser.py --config /tmp/scratch.yaml"
$P build            # writes snippets + workflows + status
$P build            # idempotent: no further writes
$P check            # in_sync (exit 0) — reconstruction matches the source

# drift + reverse sync (use a COPY so the real file is never written):
cp crunchy-notes.md /tmp/copy.md   # then point file: at it in the scratch config
# edit a snippet, then:  $P check  -> exit 2 + diff ;  $P sync  -> writes the doc
```

Notes:
- `build` is idempotent — a second run changes nothing on disk.
- `check` exits 0 only when the snippets faithfully reconstruct the source.
- `sync` writes the source/doc target, so test it against a copy.
