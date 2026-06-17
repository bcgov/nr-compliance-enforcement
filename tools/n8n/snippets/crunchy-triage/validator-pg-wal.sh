#!/usr/bin/env bash
# validator-pg-wal — read-only verdict on WAL archiving health.
#
# Cleaned from postgres-triage (a validator).
# Input:     stdin JSON — the merged collection output (reads .wal; tolerates absence).
# Read-only: a pure check over the collected JSON; no db access. Idempotent.
# Output:    stdout JSON { check: "wal", status: ok|warn|error|skip, message }.
set -euo pipefail

CHECK="wal"
data="$(cat)"; data="${data:-null}"

# Extract the values we check.
have="$(jq -r '(. // {}) | has("wal")' <<<"$data" 2>/dev/null || echo false)"
failed="$(jq -r '.wal.archiver.failed // 0' <<<"$data" 2>/dev/null || echo 0)"

# Decide the verdict.
if [ "$have" != "true" ]; then
  status="skip";  message="no WAL data"
elif [ "$failed" -gt 0 ]; then
  status="error"; message="$failed WAL archive failure(s)"
else
  status="ok";    message="WAL archiving healthy"
fi

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  '{check: $check, status: $status, message: $message}'
