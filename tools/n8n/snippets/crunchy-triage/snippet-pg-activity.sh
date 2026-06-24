#!/usr/bin/env bash
# snippet-pg-activity — read-only Postgres active / long-running queries as JSON.
#
# Cleaned from postgres-triage (hand-authored read-only psql triage; Postgres 17).
# Params:  NAMESPACE (env or $1, required) — OpenShift namespace.
#          POD or SELECTOR (env, one required) — the pod name, or a label selector to find it.
#          PGUSER / PGDATABASE (env, default postgres) — psql role + database.
# Read-only: one SELECT over pg_stat_activity (non-idle, oldest first); safe to re-run any time.
# Output:    stdout JSON { namespace, activity: [[ { pid, user, state, seconds, wait_event, query } ]] }.
set -euo pipefail

NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"
PGUSER="${PGUSER:-postgres}"
PGDATABASE="${PGDATABASE:-postgres}"

# Target pod: an explicit POD, or the first pod matching SELECTOR (a label selector). No specific
# Postgres operator/distribution is assumed — the caller says which pod is the instance.
pod="${POD:-}"
if [[ -z "$pod" ]]; then
  if [[ -z "${SELECTOR:-}" ]]; then
    jq -n --arg ns "$NS" '{namespace: $ns, error: "set POD (a pod name) or SELECTOR (a label selector) to target the postgres pod"}'
    exit 1
  fi
  pod="$(oc get pods -n "$NS" -l "$SELECTOR" -o name 2>/dev/null | head -n1)"
fi
if [[ -z "$pod" ]]; then
  jq -n --arg ns "$NS" '{namespace: $ns, error: "no postgres pod matched the given POD/SELECTOR"}'
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

data="$(oc exec -n "$NS" "$pod" -- psql -U "$PGUSER" -d "$PGDATABASE" -tAqX -c "$sql" 2>/dev/null || true)"
jq -n --arg ns "$NS" --argjson activity "${data:-[]}" '{namespace: $ns, activity: $activity}'
