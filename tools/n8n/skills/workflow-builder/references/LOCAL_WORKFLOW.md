# Local workflow — the n8n workflow as a shell script

Every workflow this skill builds also gets a **local equivalent**: a shell script a developer
runs on their machine to fire the same run without n8n. Same stages, same read-only / idempotent
contract; it writes an HTML report to `/tmp` and opens it in a browser.

Start from `assets/local-workflow.sh`, copy it to `tools/n8n/workflows/<name>.local.sh` next to
`<name>.json`, and fill the `<--` markers (group, report, page name, the collection + validator
lists).

## n8n node -> shell stage

| n8n node                            | `local-workflow.sh` stage                              |
| ----------------------------------- | ------------------------------------------------------ |
| Webhook (params)                    | the env the snippets read, set on the command line     |
| Execute-Command (one per collect)   | `bash $SNIPPETS/<snippet>.sh` into a `parts` array     |
| Execute-Command (one per validator) | `bash $SNIPPETS/<validator>.sh` on the merged JSON     |
| Code: Format (markdown)             | `jq -s 'add'` merge -> `render.sh <report>.md`         |
| Markdown -> HTML                    | `view.sh` (writes `/tmp/n8n-report/<name>.html`)       |
| Respond to Webhook (text/html)      | the file:// URL `view.sh` prints — open it in a browser|

The two stay in lockstep: every Execute-Command node is one list entry, in the same order, and
the Format -> Markdown -> Respond tail is the single render-then-view pipe.

## Collecting + merging

Each collection snippet prints one JSON object. The script collects them with `|| true` (a
failing step is just absent, never fatal) and merges with `jq -s 'add // {}'` into one object.
Because the report guards every section with `{{#if}}`, a partial or empty merge still renders
cleanly — like the n8n version fed a partial chain.

## Validating

Each validator reads the merged JSON on stdin and emits `{ check, status, message }`. The script
keys the verdicts by `.check` into `.validations`, so the report shows each verdict next to its
section. Leave the validator list empty if the workflow has none.

## Chaining reports

A report renders whatever data is present and can append a prior report's output via `.previous`.
To show more than one report on a page, render the first, then render the next with the first's
output passed as `.previous` — they accumulate top-to-bottom, all from the one merged payload.

## view.sh — Markdown -> HTML -> open

`tools/n8n/view.sh` is the local stand-in for the Markdown + Respond nodes (it is **not** used in
the n8n container — n8n has its own Markdown node):

```bash
render.sh report.md < data.json | view.sh <name>   # writes /tmp/n8n-report/<name>.html, prints a file:// URL
```

It embeds the rendered Markdown in a small HTML page that styles + renders it with marked.js +
github-markdown-css from a CDN, so no local Markdown tooling is needed.

## Running it

```bash
<ENV>=<value> tools/n8n/workflows/<name>.local.sh   # prints a file:// URL — click to open
```

Read-only and idempotent: safe to re-run any time, like firing the webhook. Shellcheck the
generated `<name>.local.sh` before committing it.
