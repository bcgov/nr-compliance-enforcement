<!-- snippet-pg-report — read-only Postgres health report. Rendered via tools/n8n/render.sh from
     the merged collection JSON. Cleaned from postgres-triage.
     Conditional + chainable: each section renders only if its data is present.
     Inputs (the keys this report can render):
       NAMESPACE     env / arg                       — the OpenShift namespace
       .connections  from snippet-pg-connections     — { max_connections, total, active, idle, idle_in_transaction }
       .activity[]   from snippet-pg-activity        — long-running / active queries
       .wal          from snippet-pg-wal             — { current_lsn, wal_bytes, archiver }
       .cache        from snippet-pg-cache           — { hit_ratio_pct, shared_buffers, work_mem, ... }
       .validations  from validator-* snippets       — per-section verdicts (status, message, docs link, pods checked)
       .tags[] / .comments / .previous               — header badges / dump / chained reports
     badges/verdict/dump/chain are shared render.sh helpers (they return "" when absent).
     Tags render as shields.io badge images (an external fetch — keep tag text non-sensitive).
-->
# Postgres health — ${NAMESPACE}

{{ badges(.tags) }}

{{#if (.connections | present) or (.activity | present) or (.wal | present) or (.cache | present) }}
{{#if .connections }}

## Connections
{{ verdict(.validations.connections) }}

- **In use:** {{ .connections.total }} / {{ .connections.max_connections }} — active {{ .connections.active }}, idle {{ .connections.idle }}, idle-in-txn {{ .connections.idle_in_transaction }}
{{/if}}
{{#if .activity }}

## Long-running / active queries
| PID | User | State | Age (s) | Query |
|-----|------|-------|---------|-------|
{{ .activity | map("| \(.pid) | \((.user // "") | gsub("[|]"; "&#124;")) | \(.state) | \(.seconds) | \((.query // "") | gsub("[|]"; "&#124;")) |") | join("\n") }}
{{/if}}
{{#if .wal }}

## WAL
{{ verdict(.validations.wal) }}

- **Current LSN:** `{{ .wal.current_lsn }}` ({{ .wal.wal_bytes }} bytes)
- **Archiver:** archived {{ .wal.archiver.archived }}, failed {{ .wal.archiver.failed }}
{{/if}}
{{#if .cache }}

## Cache & memory
{{ verdict(.validations.cache) }}

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
{{ dump(.comments) }}
```
{{/if}}
{{#if .previous }}

---

{{ chain(.previous) }}
{{/if}}
