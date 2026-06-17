#!/usr/bin/env bash
# validator-cluster-status — read-only verdict on the crunchy/patroni cluster state.
#
# Cleaned from crunchy-dr-wiki (a validator: validation kept separate from fetching).
# Input:     stdin JSON — the merged collection output (reads .members; tolerates absence).
# Read-only: a pure check over the collected JSON; no cluster access. Idempotent.
# Output:    stdout JSON { check: "cluster", status: ok|warn|error|skip, message }.
set -euo pipefail

CHECK="cluster"
data="$(cat)"; data="${data:-null}"

# Extract the values we check.
members="$(jq -r '(.members // []) | length' <<<"$data" 2>/dev/null || echo 0)"
leaders="$(jq -r '[(.members // [])[] | select(.Role == "Leader")] | length' <<<"$data" 2>/dev/null || echo 0)"
unhealthy="$(jq -r '[(.members // [])[] | select(.State != "running" and .State != "streaming") | .Member] | join(", ")' <<<"$data" 2>/dev/null || echo "")"

# Decide the verdict.
if [ "$members" -eq 0 ]; then
  status="skip";  message="no cluster member data"
elif [ "$leaders" -eq 0 ]; then
  status="error"; message="no leader elected"
elif [ -n "$unhealthy" ]; then
  status="warn";  message="$unhealthy not running/streaming"
else
  status="ok";    message="leader present; $members member(s) healthy"
fi

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  '{check: $check, status: $status, message: $message}'
