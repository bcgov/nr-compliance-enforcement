#!/usr/bin/env bash
# snippet-pg-wal — read-only Postgres WAL + archiver state as JSON.
#
# Cleaned from postgres-triage (hand-authored read-only psql triage; Postgres 17).
# Params:    NAMESPACE (env or $1, required) — the OpenShift namespace.
# Read-only: WAL position + pg_stat_archiver; run on the primary. Idempotent, safe to re-run.
# Output:    stdout JSON { namespace, wal: { current_lsn, wal_bytes, archiver: { archived, failed, ... } } }.
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

data="$(oc exec -n "$NS" "$primary" -- psql -U postgres -d postgres -tAqX -c "$sql" 2>/dev/null || true)"
jq -n --arg ns "$NS" --argjson wal "${data:-null}" '{namespace: $ns, wal: $wal}'
