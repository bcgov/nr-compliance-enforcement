#!/usr/bin/env bash
# snippet-pg-activity — read-only Postgres active / long-running queries as JSON.
#
# Cleaned from postgres-triage (hand-authored read-only psql triage; Postgres 17).
# Params:    NAMESPACE (env or $1, required) — the OpenShift namespace.
# Read-only: one SELECT over pg_stat_activity (non-idle, oldest first); safe to re-run any time.
# Output:    stdout JSON { namespace, activity: [ { pid, user, state, seconds, wait_event, query } ] }.
set -euo pipefail

NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"

primary="$(oc get pods -n "$NS" -l postgres-operator.crunchydata.com/role=master \
  -o name 2>/dev/null | head -n1)"
if [ -z "$primary" ]; then
  jq -n --arg ns "$NS" '{namespace: $ns, error: "no primary (master) pod found"}'
  exit 1
fi

read -r -d '' sql <<'SQL' || true
SELECT coalesce(json_agg(t), '[]') FROM (
  SELECT pid,
         usename AS "user",
         state,
         round(extract(epoch FROM (now() - query_start)))::int AS seconds,
         wait_event,
         left(regexp_replace(query, '\s+', ' ', 'g'), 200) AS query
  FROM pg_stat_activity
  WHERE state <> 'idle' AND query_start IS NOT NULL AND pid <> pg_backend_pid()
  ORDER BY query_start ASC
  LIMIT 10
) t;
SQL

data="$(oc exec -n "$NS" "$primary" -- psql -U postgres -d postgres -tAqX -c "$sql" 2>/dev/null || true)"
jq -n --arg ns "$NS" --argjson activity "${data:-[]}" '{namespace: $ns, activity: $activity}'
