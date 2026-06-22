#!/usr/bin/env bash
# snippet-pg-wal — read-only Postgres WAL + archiver state as JSON.
#
# Cleaned from postgres-triage (hand-authored read-only psql triage; Postgres 17).
# Params:  NAMESPACE (env or $1, required) — OpenShift namespace.
#          POD or SELECTOR (env, one required) — the primary pod, or a label selector to find it.
#          PGUSER / PGDATABASE (env, default postgres) — psql role + database.
# Read-only: WAL position + pg_stat_archiver; run on the primary. Idempotent, safe to re-run.
# Output:    stdout JSON { namespace, wal: { current_lsn, wal_bytes, archiver: { archived, failed, ... } } }.
set -euo pipefail

NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"
PGUSER="${PGUSER:-postgres}"
PGDATABASE="${PGDATABASE:-postgres}"

# Target pod: an explicit POD, or the first pod matching SELECTOR (a label selector). No specific
# Postgres operator/distribution is assumed — the caller says which pod is the instance (the primary
# for WAL state).
pod="${POD:-}"
if [[ -z "$pod" ]]; then
  if [[ -z "${SELECTOR:-}" ]]; then
    jq -n --arg ns "$NS" '{namespace: $ns, error: "set POD (a pod name) or SELECTOR (a label selector) to target the postgres primary"}'
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
  'current_lsn', pg_current_wal_lsn()::text,
  'wal_bytes', pg_wal_lsn_diff(pg_current_wal_lsn(), '0/0')::bigint,
  'archiver', (SELECT json_build_object(
     'archived', archived_count,
     'failed', failed_count,
     'last_archived_wal', last_archived_wal,
     'last_failed_wal', last_failed_wal
  ) FROM pg_stat_archiver)
);
SQL

data="$(oc exec -n "$NS" "$pod" -- psql -U "$PGUSER" -d "$PGDATABASE" -tAqX -c "$sql" 2>/dev/null || true)"
jq -n --arg ns "$NS" --argjson wal "${data:-null}" '{namespace: $ns, wal: $wal}'
