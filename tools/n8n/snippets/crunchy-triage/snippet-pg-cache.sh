#!/usr/bin/env bash
# snippet-pg-cache — read-only Postgres cache hit ratio + memory settings as JSON.
#
# Cleaned from postgres-triage (hand-authored read-only psql triage; Postgres 17).
# Params:    NAMESPACE (env or $1, required) — the OpenShift namespace.
# Read-only: pg_stat_database + settings; idempotent, safe to re-run any time.
# Output:    stdout JSON { namespace, cache: { hit_ratio_pct, shared_buffers, work_mem, effective_cache_size, maintenance_work_mem } }.
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
  'hit_ratio_pct', (SELECT round(sum(blks_hit) * 100.0 / nullif(sum(blks_hit) + sum(blks_read), 0), 2) FROM pg_stat_database),
  'shared_buffers', current_setting('shared_buffers'),
  'work_mem', current_setting('work_mem'),
  'effective_cache_size', current_setting('effective_cache_size'),
  'maintenance_work_mem', current_setting('maintenance_work_mem')
);
SQL

data="$(oc exec -n "$NS" "$primary" -- psql -U postgres -d postgres -tAqX -c "$sql" 2>/dev/null || true)"
jq -n --arg ns "$NS" --argjson cache "${data:-null}" '{namespace: $ns, cache: $cache}'
