#!/usr/bin/env bash
# snippet-pg-cache — read-only Postgres cache hit ratio + memory settings as JSON.
#
# Cleaned from postgres-triage (hand-authored read-only psql triage; Postgres 17).
# Params:  NAMESPACE (env or $1, required) — OpenShift namespace.
#          POD or SELECTOR (env, one required) — the pod name, or a label selector to find it.
#          PGUSER / PGDATABASE (env, default postgres) — psql role + database.
# Read-only: pg_stat_database + settings; idempotent, safe to re-run any time.
# Output:    stdout JSON { namespace, cache: { hit_ratio_pct, shared_buffers, work_mem, effective_cache_size, maintenance_work_mem } }.
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
  'hit_ratio_pct', (SELECT round(sum(blks_hit) * 100.0 / nullif(sum(blks_hit) + sum(blks_read), 0), 2) FROM pg_stat_database),
  'shared_buffers', current_setting('shared_buffers'),
  'work_mem', current_setting('work_mem'),
  'effective_cache_size', current_setting('effective_cache_size'),
  'maintenance_work_mem', current_setting('maintenance_work_mem')
);
SQL

data="$(oc exec -n "$NS" "$pod" -- psql -U "$PGUSER" -d "$PGDATABASE" -tAqX -c "$sql" 2>/dev/null || true)"
jq -n --arg ns "$NS" --argjson cache "${data:-null}" '{namespace: $ns, cache: $cache}'
