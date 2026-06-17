<!-- snippet-pg-report — read-only Postgres health report. Rendered via tools/n8n/render.sh from
     the merged collection JSON. Cleaned from postgres-triage.
     Conditional + chainable: each section renders only if its data is present.
     Inputs (the keys this report can render):
       NAMESPACE     env / arg                       — the OpenShift namespace
       .connections  from snippet-pg-connections     — { max_connections, total, active, idle, idle_in_transaction }
       .activity[]   from snippet-pg-activity        — long-running / active queries
       .wal          from snippet-pg-wal             — { current_lsn, wal_bytes, archiver }
       .cache        from snippet-pg-cache           — { hit_ratio_pct, shared_buffers, work_mem, ... }
       .validations  from validator-* snippets       — per-section verdicts shown by their data
       .tags[] / .comments / .previous               — header badges / dump / chained reports
     Tags render as shields.io badge images (an external fetch — keep tag text non-sensitive).
-->
# Postgres health — ${NAMESPACE}

{{#if .tags }}
{{ .tags | map("![" + . + "](https://img.shields.io/badge/-" + (gsub("_";"__")|gsub("-";"--")|gsub(" ";"%20")) + "-555)") | join(" ") }}
{{/if}}

{{#if (.connections | present) or (.activity | present) or (.wal | present) or (.cache | present) }}
{{#if .connections }}

## Connections
{{#if .validations.connections }}
> **{{ .validations.connections.status | ascii_upcase }}** — {{ .validations.connections.message }}

{{/if}}
- **In use:** {{ .connections.total }} / {{ .connections.max_connections }} — active {{ .connections.active }}, idle {{ .connections.idle }}, idle-in-txn {{ .connections.idle_in_transaction }}
{{/if}}
{{#if .activity }}

## Long-running / active queries
| PID | User | State | Age (s) | Query |
|-----|------|-------|---------|-------|
{{ .activity | map("| \(.pid) | \(.user) | \(.state) | \(.seconds) | \(.query) |") | join("\n") }}
{{/if}}
{{#if .wal }}

## WAL
{{#if .validations.wal }}
> **{{ .validations.wal.status | ascii_upcase }}** — {{ .validations.wal.message }}

{{/if}}
- **Current LSN:** `{{ .wal.current_lsn }}` ({{ .wal.wal_bytes }} bytes)
- **Archiver:** archived {{ .wal.archiver.archived }}, failed {{ .wal.archiver.failed }}
{{/if}}
{{#if .cache }}

## Cache & memory
{{#if .validations.cache }}
> **{{ .validations.cache.status | ascii_upcase }}** — {{ .validations.cache.message }}

{{/if}}
- **Cache hit ratio:** {{ .cache.hit_ratio_pct }}%
- shared_buffers `{{ .cache.shared_buffers }}`, work_mem `{{ .cache.work_mem }}`, effective_cache_size `{{ .cache.effective_cache_size }}`
{{/if}}
{{else}}
_No Postgres data collected for `${NAMESPACE}`._
{{/if}}
{{#if .comments }}

---

#### Notes

```
{{ .comments | if type == "array" then map(tostring) | join("\n") elif type == "string" then . else tojson end }}
```
{{/if}}
{{#if .previous }}

---

{{ .previous | if type == "array" then join("\n\n---\n\n") else . end }}
{{/if}}
