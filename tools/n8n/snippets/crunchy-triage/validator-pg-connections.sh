#!/usr/bin/env bash
# validator-pg-connections — read-only verdict on Postgres connection headroom.
#
# Cleaned from postgres-triage (a validator).
# Input:     stdin JSON — the merged collection output (reads .connections; tolerates absence).
# Read-only: a pure check over the collected JSON; no db access. Idempotent.
# Output:    stdout JSON { check: "connections", status: ok|warn|error|skip, message }.
set -euo pipefail

CHECK="connections"
data="$(cat)"; data="${data:-null}"

# Extract the values we check.
have="$(jq -r '(. // {}) | has("connections")' <<<"$data" 2>/dev/null || echo false)"
max="$(jq -r '.connections.max_connections // 0' <<<"$data" 2>/dev/null || echo 0)"
total="$(jq -r '.connections.total // 0' <<<"$data" 2>/dev/null || echo 0)"

# Decide the verdict.
if [ "$have" != "true" ] || [ "$max" -le 0 ]; then
  status="skip";  message="no connection data"
else
  pct=$(( total * 100 / max ))
  if [ "$pct" -ge 90 ]; then
    status="error"; message="$total/$max connections in use (${pct}%) — near the limit"
  elif [ "$pct" -ge 75 ]; then
    status="warn";  message="$total/$max connections in use (${pct}%)"
  else
    status="ok";    message="$total/$max connections in use (${pct}%)"
  fi
fi

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  '{check: $check, status: $status, message: $message}'
