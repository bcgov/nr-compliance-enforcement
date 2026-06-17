#!/usr/bin/env bash
# validator-pg-cache — read-only verdict on the Postgres buffer-cache hit ratio.
#
# Cleaned from postgres-triage (a validator).
# Input:     stdin JSON — the merged collection output (reads .cache; tolerates absence).
# Read-only: a pure check over the collected JSON; no db access. Idempotent.
# Output:    stdout JSON { check: "cache", status: ok|warn|error|skip, message }.
set -euo pipefail

CHECK="cache"
data="$(cat)"; data="${data:-null}"

# Extract the hit ratio (float for the message, floored int for the comparison).
ratio="$(jq -r '.cache.hit_ratio_pct // empty' <<<"$data" 2>/dev/null || echo "")"
ratio_int="$(jq -r '(.cache.hit_ratio_pct // 100) | floor' <<<"$data" 2>/dev/null || echo 100)"

# Decide the verdict.
if [ -z "$ratio" ]; then
  status="skip";  message="no cache data"
elif [ "$ratio_int" -lt 90 ]; then
  status="warn";  message="cache hit ratio ${ratio}% is low (< 90%)"
else
  status="ok";    message="cache hit ratio ${ratio}%"
fi

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  '{check: $check, status: $status, message: $message}'
