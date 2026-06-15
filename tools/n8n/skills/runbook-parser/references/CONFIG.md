# config.yaml — schema and model

`config.yaml` is the single manifest for a `RunbookParser`. It is shaped like a Kubernetes
CRD: **`spec:`** is what you write (and is never rewritten, so its comments survive), and
**`status:`** is observed state the parser writes back on `build`.

```
kind: RunbookParser          # required, must be exactly this
metadata:
  name: <string>
  labels: { owner: <string> }
spec:                        # human-authored; the parser only reads this
  root: tools/n8n/           # repo-relative base for outputs (workflows/ live here)
  destination: tools/n8n/snippets/   # where Tier-1 + Tier-2 snippets are written
  working_dir: /tmp          # fetch cache for url sources (override: RUNBOOK_PARSER_CACHE)
  sources: [ ... ]           # see below
  runbooks: [ ... ]          # see below
status: { ... }              # machine-owned; written by the parser (do not hand-maintain)
```

## spec.sources[]

| Field         | Type            | Meaning                                                                 |
| ------------- | --------------- | ----------------------------------------------------------------------- |
| `name`        | string          | Group key. Sources sharing a `name` **merge** into one snippet group.   |
| `description` | string          | What the snippets are. First non-empty wins for the merged group.       |
| `url`         | string \| null  | Wiki/doc/runbook to pull from. Set **exactly one** of `url`/`file`.     |
| `file`        | string \| null  | Repo-relative file to pull from instead of a URL.                       |
| `doc`         | string \| null  | Optional `root`-relative doc the snippets recombine into for drift.     |

- **Merge:** same `name` -> one `destination/<name>/` group. Snippet order is
  `(source index, in-source order)`, so a re-run is byte-stable. Combine domains this way
  (e.g. a crunchy wiki source + a postgres `psql` source -> one `crunchy-triage` group).
- **Placeholder:** a source with neither `url` nor `file` (`kind: none`) contributes no
  extracted snippets — a slot for hand-authored snippets in the same group.
- **url normalization:** GitHub `blob` URLs become `raw.githubusercontent.com`; GitHub
  `/wiki/Page` becomes the raw wiki `.md`. Fetches cache into `working_dir`.

## spec.runbooks[]

| Field           | Type      | Meaning                                                       |
| --------------- | --------- | ------------------------------------------------------------ |
| `name`          | string    | Output name -> `tools/n8n/workflows/<name>.md` (+ `.sh`).    |
| `snippets_from` | [string]  | Group names to recombine, in order.                          |

A runbook recombines the listed groups in order into a Markdown workflow (prose + code),
and additionally a `.sh` of the shell snippets when the runbook contains any.

## The drift round-trip (`src -> snippets -> doc`)

The parser decomposes a source losslessly, so recombining the snippets reproduces the
document. Drift detection compares that reconstruction against the doc target:

- If `doc:` is set, the target is `root/doc`. If not, the target is the source itself
  (`src == doc`).
- `build` records each source's drift state in `status` (`in_sync` / `drifted` /
  `doc_missing`). `check` re-computes it and exits **2** on drift. `sync` writes the
  reconstruction back to the target (the reverse direction).
- Comparison is whitespace-lenient (trailing whitespace and the final newline are
  ignored), so cosmetic edits do not register as drift. `sync` writes byte-faithfully, so
  a backport diff shows only the real change.

## status (written by the parser)

Do not hand-maintain `status`, with one exception: the **`tier2`** and **`tier2_reason`**
fields are yours to set when you adjust or drop a snippet — the parser preserves them
across re-`build`s (keyed by group + file).

```yaml
status:
  groups:
    crunchy-triage:
      sources:
        - ref: crunchy-notes.md
          kind: file
          source_last_updated: "2025-11-06T17:22:20Z"   # file mtime; url is best-effort
          doc: null
          drift: in_sync
      snippets:
        - id: crunchy-notes_get-state-info
          file: crunchy-notes_get-state-info.sh
          lang: sh
          section: "Get State Info"
          order: 3
          fence_info: bash               # original fence info, for faithful round-trip
          provenance: { ref: crunchy-notes.md, line: 13 }
          tier2: adjusted | dropped | pending
          tier2_reason: "mutates cluster (patronictl reinit) — not idempotent"
```

## Comment safety

The parser rewrites only from a top-level `status:` marker to end-of-file; everything above
(your commented `spec`) is left byte-for-byte. That is why machine-maintained timestamps
live in `status`, not inline in `spec`. The `spec` is parsed with PyYAML, so any valid YAML
is fine.
