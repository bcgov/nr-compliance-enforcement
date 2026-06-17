#!/usr/bin/env bash
# snippet-pg-connections — read-only Postgres connection usage as JSON.
#
# Cleaned from postgres-triage (hand-authored read-only psql triage; Postgres 17).
# Params:    NAMESPACE (env or $1, required) — the OpenShift namespace.
# Read-only: one SELECT over pg_stat_activity + settings; idempotent, safe to re-run any time.
# Output:    stdout JSON { namespace, connections: { max_connections, reserved, total, active, idle, idle_in_transaction } }.
set -euo pipefail

NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"

primary="$(oc get pods -n "$NS" -l postgres-operator.crunchydata.com/role=master \
  -o name 2>/dev/null | head -n1)"
if [ -z "$primary" ]; then
  jq -n --arg ns "$NS" '{namespace: $ns, error: "no primary (master) pod found"}'
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

data="$(oc exec -n "$NS" "$primary" -- psql -U postgres -d postgres -tAqX -c "$sql" 2>/dev/null || true)"
jq -n --arg ns "$NS" --argjson connections "${data:-null}" '{namespace: $ns, connections: $connections}'
