# Local workflow — the n8n workflow as a shell script

Every workflow this skill builds also gets a **local equivalent**: a shell script a developer
runs on their machine to fire the same triage without n8n. Same stages, same read-only /
idempotent contract; it writes an HTML report to `/tmp` and opens it in a browser.

Start from `assets/local-workflow.sh`, copy it to `tools/n8n/workflows/<name>.local.sh` next to
`<name>.json`, and fill the `<--` markers (group, report template, page name, the snippet lines).

## n8n node -> shell stage

| n8n node                          | `local-workflow.sh` stage                                |
| --------------------------------- | -------------------------------------------------------- |
| Webhook (params)                  | CLI args / env (`NAMESPACE`, ...) at the top             |
| Execute-Command (one per snippet) | `bash $SNIPPETS/snippet-*.sh` into a `parts` array       |
| Code: Format (markdown)           | `jq -s 'add'` merge -> `render.sh <report>.md`           |
| Markdown -> HTML                  | `view.sh` (writes `/tmp/n8n-report/<name>.html`)         |
| Respond to Webhook (text/html)    | the file:// URL `view.sh` prints — open it in a browser  |

The two stay in lockstep: every Execute-Command node is one `parts+=("$(... snippet)")` line, in
the same order, and the Format -> Markdown -> Respond tail is the single render-then-view pipe.

## Collecting + merging

Each cleaned snippet prints one JSON object. The script collects them with `|| true` (a failing
step is just absent, never fatal) and merges with `jq -s 'add // {}'` into one object for the
report. Because the report template guards every section with `{{#if}}`, a partial or empty
merge still renders cleanly — exactly like the n8n version fed a partial chain.

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
NAMESPACE=f208ae-dev tools/n8n/workflows/crunchy-triage.local.sh   # prints a file:// URL — click to open
```

Read-only and idempotent: safe to re-run any time, like firing the webhook. Shellcheck the
generated `<name>.local.sh` before committing it.
