#!/usr/bin/env bash
# snippet-pg-connections — read-only Postgres connection usage as JSON.
#
# Cleaned from postgres-triage (hand-authored read-only psql triage; Postgres 17).
# Params:  NAMESPACE (env or $1, required) — OpenShift namespace.
#          POD or SELECTOR (env, one required) — the pod name, or a label selector to find it.
#          PGUSER / PGDATABASE (env, default postgres) — psql role + database.
# Read-only: one SELECT over pg_stat_activity + settings; idempotent, safe to re-run any time.
# Output:    stdout JSON { namespace, connections: { max_connections, reserved, total, active, idle, idle_in_transaction } }.
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
SELECT json_build_object(
  'max_connections', current_setting('max_connections')::int,
  'reserved', current_setting('superuser_reserved_connections')::int,
  'total', count(*),
  'active', count(*) FILTER (WHERE state = 'active'),
  'idle', count(*) FILTER (WHERE state = 'idle'),
  'idle_in_transaction', count(*) FILTER (WHERE state = 'idle in transaction')
) FROM pg_stat_activity;
SQL

data="$(oc exec -n "$NS" "$pod" -- psql -U "$PGUSER" -d "$PGDATABASE" -tAqX -c "$sql" 2>/dev/null || true)"
jq -n --arg ns "$NS" --argjson connections "${data:-null}" '{namespace: $ns, connections: $connections}'
