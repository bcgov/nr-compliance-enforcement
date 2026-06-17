<!-- snippet-triage-report — read-only triage report. Rendered via tools/n8n/render.sh from the
     merged collection JSON. Cleaned from crunchy-dr-wiki.
     Conditional: each section renders only if its data is present, so the report stays clean
     whichever collection snippets ran upstream (or none at all).
     Inputs (the keys this report can render):
       NAMESPACE       env / arg                     — the OpenShift namespace
       .primary_pod    from snippet-cluster-status   — current primary pod name
       .members[]      from snippet-cluster-status   — patroni members (Member/Role/State/Lag in MB/TL)
       .pgbackrest[]   from snippet-pgbackrest-info  — pgBackRest stanzas (name/status.message)
       .tags[]         any upstream node             — extra header capsule badges (array of strings)
       .comments       any upstream node             — free-form dump shown at the bottom
     Tags render as shields.io badge images (an external fetch — keep tag text non-sensitive).
-->
# Crunchy triage — ${NAMESPACE}

![Postgres 17](https://img.shields.io/badge/-postgres%2017-informational)
{{#if .tags }}
{{ .tags | map("![" + . + "](https://img.shields.io/badge/-" + (gsub("_";"__")|gsub("-";"--")|gsub(" ";"%20")) + "-555)") | join(" ") }}
{{/if}}

{{#if (.primary_pod | present) or (.members | present) or (.pgbackrest | present) }}
{{#if .primary_pod }}
**Primary pod:** {{ .primary_pod }}
{{/if}}
{{#if .members }}

## Cluster members
| Member | Role | State | Lag (MB) | TL |
|--------|------|-------|----------|----|
{{ .members | map("| \(.Member) | \(.Role) | \(.State) | \(.["Lag in MB"] // "-") | \(.TL // "-") |") | join("\n") }}
{{/if}}
{{#if .pgbackrest }}

## pgBackRest
{{ .pgbackrest | map("- **\(.name)** — \(.status.message)") | join("\n") }}
{{/if}}
{{else}}
_No triage data collected for `${NAMESPACE}`._
{{/if}}
{{#if .comments }}

---

#### Notes

```
{{ .comments | if type == "array" then map(tostring) | join("\n") elif type == "string" then . else tojson end }}
```
{{/if}}
