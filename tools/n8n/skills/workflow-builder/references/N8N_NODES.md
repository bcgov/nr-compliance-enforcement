# n8n nodes for a triage workflow

Every triage workflow is the same shape: a **Webhook** trigger (+ a **Sticky Note** with the
production URL), a chain of **Execute-Command** nodes running cleaned snippets (read-only,
idempotent), then **Format -> Markdown -> Respond to Webhook** to serve an HTML page.

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
    "command": "=PARAM={{ $('Webhook').item.json.query.param }} bash tools/n8n/snippets/<group>/<snippet>.sh"
  },
  "id": "step-collect-1", "name": "Collect (read-only)",
  "type": "n8n-nodes-base.executeCommand", "typeVersion": 1, "position": [480, 300],
  "notes": "READ-ONLY + IDEMPOTENT. Runs a cleaned snippet-*; safe to re-run any time."
}
```

- One node per cleaned snippet, chained so each feeds the next; pass upstream values via env
  or args (`{{ $json.field }}`).
- **Always set `notes` to state read-only + idempotent** — belt-and-suspenders on top of the
  cleaned-snippet contract.
- The snippet emits JSON on stdout; n8n parses it for the next node. If a snippet emits plain
  text, add a Code node to wrap it as JSON.

## 4. Format output — build the report markdown

A Code node (predictable) that turns the chained JSON into one markdown string. Reuse
`tools/n8n/render.sh` here for any cleaned `.md` display template.

```json
{
  "parameters": {
    "jsCode": "const rows = $input.all().map(i => i.json);\nconst md = `# Triage report\\n\\n\\`\\`\\`json\\n${JSON.stringify(rows, null, 2)}\\n\\`\\`\\``;\nreturn [{ json: { markdown: md } }];"
  },
  "id": "format", "name": "Format output (markdown)",
  "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [700, 300]
}
```

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
