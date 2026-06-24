<!-- snippet-app-report — read-only application triage report. Rendered via tools/n8n/render.sh
     from the merged collection JSON. Cleaned from nr-ce-app-triage.
     Conditional + chainable: each section renders only when its data is present, so the report
     degrades cleanly no matter which services reported (the outer {{else}} handles "nothing").
     Inputs (the keys this report can render):
       NAMESPACE      env / arg                   — the OpenShift namespace
       .<svc>_logs    from snippet-app-logs       — { service, pods, pod_count, lines, line_count, ... } per service
       .<svc>_errors  from snippet-app-errors     — { service, matches, match_count, patterns, ... } per service
       .validations   from validator-* snippets   — availability + errors verdicts (status, message, docs, sources)
       .tags[] / .comments / .previous            — header badges / dump / chained reports
     badges/verdict/dump/chain/cell are shared render.sh helpers (they return "" when absent).
     Tables render as HTML <table> (a markdown table can drop rows in marked.js); wrap every cell
     in cell(...) so a log line can never break the row.
-->
# App triage — ${NAMESPACE}

{{ badges(.tags) }}

{{#if (([to_entries[] | select((.key | endswith("_logs")) or (.key | endswith("_errors")))] | length) > 0) }}
{{#if (([to_entries[] | select(.key | endswith("_logs"))] | length) > 0) }}

## Services
{{ verdict(.validations.availability) }}

<table>
<thead><tr><th>Service</th><th>Pods</th><th>Log lines</th><th>Error matches</th></tr></thead>
<tbody>
{{ . as $r | [$r | to_entries[] | select(.key | endswith("_logs")) | .value] | map("<tr><td>\(cell(.service))</td><td>\(cell(.pod_count))</td><td>\(cell(.line_count))</td><td>\(cell($r[(.service) + "_errors"].match_count // 0))</td></tr>") | join("\n") }}
</tbody>
</table>
{{/if}}
{{#if (([to_entries[] | select((.key | endswith("_logs")) and ((.value.line_count // 0) > 0))] | length) > 0) }}

## Recent logs

{{ [to_entries[] | select(.key | endswith("_logs")) | .value | select((.line_count // 0) > 0)] | map("**\(.service)** — last \([.line_count, 10] | min) of \(.line_count) line(s)\n\n```\n" + (.lines[-10:] | join("\n")) + "\n```") | join("\n\n") }}
{{/if}}
{{#if (([to_entries[] | select((.key | endswith("_errors")) and ((.value.match_count // 0) > 0))] | length) > 0) }}

## Recent errors
{{ verdict(.validations.errors) }}

{{ [to_entries[] | select(.key | endswith("_errors")) | .value | select((.match_count // 0) > 0)] | map("**\(.service)** — \(.match_count) match(es)\n\n```\n" + (.matches | join("\n")) + "\n```") | join("\n\n") }}
{{/if}}
{{else}}
_No application data collected for `${NAMESPACE}`._
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
