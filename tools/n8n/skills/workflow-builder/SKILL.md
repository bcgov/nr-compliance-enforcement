---
name: workflow-builder
description: Compose and chain cleaned snippets into n8n operational triage workflows — a webhook trigger, read-only idempotent triage steps in order, and a markdown-to-HTML response served back to the caller. Produces n8n workflow JSON in tools/n8n/workflows/ ready to POST to the n8n API (you post it, not the skill). Use when building or iterating a triage workflow from cleaned snippets.
owner: Compliance and Enforcement
tags: [n8n, workflow, triage, webhook, automation]
---

# Workflow Builder

Takes **cleaned** snippets (produced by the `runbook-parser` skill) and chains them into an
n8n **workflow JSON** that performs operational triage. The workflow is webhook-triggered and
serves an HTML page of the results, so an operator can click a URL and read the triage report
in a browser.

Every step is **read-only and idempotent** — the cleaned-snippet contract already guarantees
this, and this skill restates it on each node as a second line of defence. No mutating steps
(PITR, `patronictl reinit`, restores, edits) ever go into a triage workflow.

Shape of every workflow this skill builds:

```
[Sticky Note: production URL]   [Webhook (responseMode=responseNode)]
                                          │
        ┌─────────────────────────────────┘
        ▼
  cleaned snippet → cleaned snippet → …    (Execute-Command, chained, read-only)
        ▼
  Format output (markdown) → Markdown (markdown→HTML) → Respond to Webhook (Content-Type: text/html)
```

It writes the JSON to `tools/n8n/workflows/<name>.json`. It does **not** POST it —
`tools/n8n/push.sh` does that.

## Use When

- Building an n8n triage workflow by chaining cleaned `snippet-*` blocks from `snippets/<group>/`.
- Iterating on an existing triage workflow (add/remove/re-order steps).
- Producing n8n workflow JSON to hand to `push.sh` / the n8n API.

## Don't Use When

- Cleaning raw snippets into cleaned blocks → use the `runbook-parser` skill (`references/CLEANING.md`).
- Posting or pulling workflow JSON to/from n8n → use `tools/n8n/push.sh` / `pull.sh`.
- Any mutating or non-triage automation → this skill only emits read-only, idempotent triage.

## Workflow

1. Choose the cleaned snippets to chain, in triage order, from `snippets/<group>/`. If none
   exist yet, run the `runbook-parser` cleaning step first.
2. Copy `assets/skeleton.json` as the starting point — it already has the Sticky Note (with
   the production URL placeholder), the Webhook (`responseMode: responseNode`), and the
   Format -> Markdown -> Respond tail.
3. For each cleaned snippet, add an `n8n-nodes-base.executeCommand` node that runs it (passing
   the upstream JSON via args/env), chained so each feeds the next. Set each node's `notes` to
   state it is read-only and idempotent (`references/N8N_NODES.md`).
4. Keep the tail: Format output (build the report markdown, reusing `tools/n8n/render.sh` for
   `.md` display snippets) -> Markdown node (`markdownToHtml`) -> Respond to Webhook with
   `Content-Type: text/html` (the serve-HTML-via-webhook pattern, n8n template 5173).
5. Update the Sticky Note with the real production webhook URL so users can click it.
6. Write valid workflow JSON (`name`, `nodes`, `connections`, `settings`) to
   `tools/n8n/workflows/<name>.json` per `references/API_SCHEMA.md`. Do not POST it.

## Rules

- Every node is read-only and idempotent, and its `notes` says so (Why: triage must be safe
  to fire repeatedly from a webhook, by anyone with the URL).
- Never include a mutating step. If a cleaned snippet is not read-only, it should already be
  dropped upstream; never add one here.
- Always start with a Webhook trigger plus a Sticky Note holding the production URL.
- Always end Format output -> Markdown (markdown->HTML) -> Respond to Webhook with
  `Content-Type: text/html`; the Webhook node `responseMode` must be `responseNode`.
- Emit only the API-writable fields (`name`, `nodes`, `connections`, `settings`); never POST —
  hand the file to `push.sh`.
- Give every node a unique `name` and `id`, and wire `connections` by node name.
- Reuse `tools/n8n/render.sh` for markdown templating of cleaned `.md` display snippets.

## Examples

- "Build a crunchy triage workflow" then chain the cleaned crunchy collection blocks
  (cluster status, patroni/pgbackrest info, db metrics), end with markdown->HTML->respond,
  and write `tools/n8n/workflows/crunchy-triage.json`.
- "Add the pgbackrest check to the triage workflow" then insert one Execute-Command node and
  rewire `connections`.
- "Serve the report as a web page" then confirm the Webhook is `responseNode` and the final
  Respond-to-Webhook sets `Content-Type: text/html`.

## Edge Cases

- A snippet emits non-JSON then normalize it in a Code node before chaining.
- No cleaned snippets exist then run the `runbook-parser` cleaning step first.
- The page renders blank then check the Markdown node outputs to the field the Respond node
  reads (`data`), and that `responseMode` is `responseNode`.
- Long-running steps then keep the webhook responsive by chaining quick read-only checks; do
  not block on anything that mutates or waits.

## References

- `references/N8N_NODES.md` — the node JSON for each type (webhook, sticky note,
  execute-command, code/format, markdown, respond-to-webhook), connections, and the
  serve-HTML pattern.
- `references/API_SCHEMA.md` — the n8n workflow JSON schema to POST (`name`/`nodes`/
  `connections`/`settings`), per the n8n API reference; `push.sh` posts it.
- `assets/skeleton.json` — a minimal, importable workflow (sticky + webhook + format +
  markdown + respond) to copy and extend.
- `../runbook-parser/references/CLEANING.md` — where the cleaned snippets come from.
