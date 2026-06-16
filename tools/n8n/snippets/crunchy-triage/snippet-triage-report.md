<!-- snippet-triage-report — read-only triage report. Rendered via tools/n8n/render.sh from the
     merged collection JSON. Cleaned from crunchy-dr-wiki.
     Inputs (the keys this template expects):
       NAMESPACE       env / arg                     — the OpenShift namespace
       .primary_pod    from snippet-cluster-status   — current primary pod name
       .members[]      from snippet-cluster-status   — patroni members (Member/Role/State/Lag in MB/TL)
       .pgbackrest[]   from snippet-pgbackrest-info  — pgBackRest stanzas (name/status.message)
-->
# Crunchy triage — ${NAMESPACE}

**Primary pod:** {{ .primary_pod }}

## Cluster members
| Member | Role | State | Lag (MB) | TL |
|--------|------|-------|----------|----|
{{ .members | map("| \(.Member) | \(.Role) | \(.State) | \(.["Lag in MB"] // "-") | \(.TL // "-") |") | join("\n") }}

## pgBackRest
{{ .pgbackrest | map("- **\(.name)** — \(.status.message)") | join("\n") }}
