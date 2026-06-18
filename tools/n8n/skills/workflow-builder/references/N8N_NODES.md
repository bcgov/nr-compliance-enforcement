# n8n nodes for a triage workflow

Every triage workflow is the same shape: a **Webhook** trigger (+ a **Sticky Note** with the
production URL), a chain of **Execute-Command** nodes running cleaned snippets (read-only,
idempotent), then **merge.sh + report.sh -> Markdown -> Respond to Webhook** to serve an HTML page.

A node is a JSON object:

```json
{
  "parameters": { },
  "id": "unique-id",
  "name": "Unique Node Name",
  "type": "n8n-nodes-base.<kind>",
  "typeVersion": 1,
  "position": [x, y],
  "notes": "READ-ONLY + IDEMPOTENT. ..."
}
```

`connections` wire nodes by **name** (see `API_SCHEMA.md`). Give every node a unique `name`
and `id`; the Sticky Note has no connections.

## 1. Sticky Note — the production URL (clickable)

```json
{
  "parameters": {
    "content": "## <TITLE> — production URL\n\n**<BASE_URL>/webhook/<PATH>?<QUERY>**\n\n(filled from assets/sticky-note.md)",
    "height": 220, "width": 360, "color": 4
  },
  "id": "note-prod-url", "name": "Production URL",
  "type": "n8n-nodes-base.stickyNote", "typeVersion": 1, "position": [200, 80]
}
```

Place it next to the Webhook. Fill `content` from `assets/sticky-note.md`: `<BASE_URL>` is
`spec.n8n.base_url` in `tools/n8n/config.yaml` and `<PATH>` is the Webhook node's path, so the
URL is `<base_url>/webhook/<path>` (the n8n **Production URL** shown on the Webhook node).

## 2. Webhook trigger (returns via a Respond node)

```json
{
  "parameters": { "httpMethod": "GET", "path": "triage", "responseMode": "responseNode", "options": {} },
  "id": "webhook", "name": "Webhook",
  "type": "n8n-nodes-base.webhook", "typeVersion": 2, "position": [260, 300],
  "webhookId": "webhook"
}
```

`responseMode: responseNode` is required — it makes a downstream **Respond to Webhook** node
send the response (so we can return HTML). `GET` so the URL is clickable in a browser.

## 3. Execute-Command — one per cleaned snippet (read-only, idempotent)

```json
{
  "parameters": {
    "command": "=PARAM={{ $('Webhook').item.json.query.param }} <snippet>.sh"
  },
  "id": "step-collect-1", "name": "Collect (read-only)",
  "type": "n8n-nodes-base.executeCommand", "typeVersion": 1, "position": [480, 300],
  "notes": "READ-ONLY + IDEMPOTENT. Runs a cleaned snippet-*; safe to re-run any time."
}
```

- One node per cleaned snippet (a collection node), run from the webhook params — they do NOT feed
  each other; `merge.sh` (§4) combines their outputs. A validator node pipes the merged JSON in:
  `echo {{ $('Merge snippets').item.json.stdout.base64Encode() }} | base64 -d | validator-*.sh`.
- **Always set `notes` to state read-only + idempotent** — belt-and-suspenders on top of the
  cleaned-snippet contract.
- The snippet emits JSON on stdout; n8n parses it for the next node. If a snippet emits plain
  text, add a Code node to wrap it as JSON.

## 4. Merge + report — combine outputs and render (no Code nodes)

Join with `merge.sh` (never a Code node) and render with `report.sh` — the image bakes the tree
under `/opt/triage` and its entrypoint adds `/opt/triage` + every baked `snippets/<group>` dir to
`PATH` at startup, so node commands call them by bare name for any group (never `/data`, a runtime
PVC mount that shadows the image). Each upstream stdout is passed base64-encoded so its JSON
survives the shell; a merge node's `export` block is multi-line — one line per input, the one place
a node command spans lines. In git that long command is stored as a JSON ARRAY of lines (push.sh
joins it with `\n`; pull.sh splits a > 200-char multi-line command back) so diffs stay readable —
n8n still receives one string. Short single-line commands (snippets, validators) stay plain strings.

**Merge snippets** — flat, so snippet fields stay top-level (`.members`, `.connections`, …):

```json
{
  "parameters": {
    "command": [
      "=export MERGE_CLUSTER={{ $('Cluster status (read-only)').item.json.stdout.base64Encode() }}",
      "export MERGE_WAL={{ $('PG WAL (read-only)').item.json.stdout.base64Encode() }}",
      "merge.sh --b64"
    ]
  },
  "id": "merge-snippets", "name": "Merge snippets",
  "type": "n8n-nodes-base.executeCommand", "typeVersion": 1, "position": [1800, 360]
}
```

**Merge validations** is the same over the validator nodes but ends `merge.sh -k --b64`
(keyed by check -> the `.validations` object). **Report** assembles + renders:

```json
{
  "parameters": {
    "command": [
      "=export DATA={{ $('Merge snippets').item.json.stdout.base64Encode() }}",
      "export VALS={{ $('Merge validations').item.json.stdout.base64Encode() }}",
      "export NAMESPACE={{ ($('Webhook').item.json.query||{}).namespace }}",
      "report.sh <group> <report.md>"
    ]
  },
  "id": "report", "name": "Report",
  "type": "n8n-nodes-base.executeCommand", "typeVersion": 1, "position": [3340, 360]
}
```

`report.sh` echoes the report markdown for the Markdown node.

## 5. Markdown -> HTML

```json
{
  "parameters": { "mode": "markdownToHtml", "markdown": "={{ $json.markdown }}", "options": {} },
  "id": "md2html", "name": "Markdown to HTML",
  "type": "n8n-nodes-base.markdown", "typeVersion": 1, "position": [920, 300]
}
```

Outputs the HTML into `data` by default (the field the Respond node reads).

## 6. Respond to Webhook — serve HTML (template 5173 pattern)

```json
{
  "parameters": {
    "respondWith": "text",
    "responseBody": "={{ $json.data }}",
    "options": {
      "responseHeaders": { "entries": [ { "name": "Content-Type", "value": "text/html" } ] }
    }
  },
  "id": "respond", "name": "Respond to Webhook (HTML)",
  "type": "n8n-nodes-base.respondToWebhook", "typeVersion": 1, "position": [1140, 300]
}
```

This is the serve-a-web-page-from-a-webhook pattern from n8n template **5173**
(`https://n8n.io/workflows/5173-serve-custom-websites-html-webpages-with-webhooks/`): the
webhook responds with `Content-Type: text/html`, so opening the URL renders the report.

## Validate

Import the finished JSON into n8n (or `push.sh --dry-run`) to confirm node types/versions
resolve on your n8n version, then activate. typeVersions above target a recent n8n; bump them
if the editor complains.
