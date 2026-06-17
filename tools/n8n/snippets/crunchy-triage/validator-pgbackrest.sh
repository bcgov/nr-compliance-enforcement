#!/usr/bin/env bash
# validator-pgbackrest — read-only verdict on pgBackRest backup state.
#
# Cleaned from crunchy-dr-wiki (a validator: validation kept separate from fetching).
# Input:     stdin JSON — the merged collection output (reads .pgbackrest; tolerates absence).
# Read-only: a pure check over the collected JSON; no cluster access. Idempotent.
# Output:    stdout JSON { check: "pgbackrest", status: ok|warn|error|skip, message }.
set -euo pipefail

CHECK="pgbackrest"
data="$(cat)"; data="${data:-null}"

# Extract the values we check.
count="$(jq -r '(.pgbackrest // []) | length' <<<"$data" 2>/dev/null || echo 0)"
notok="$(jq -r '[(.pgbackrest // [])[] | select((.status.message // "") != "ok") | .name] | join(", ")' <<<"$data" 2>/dev/null || echo "")"
nobackup="$(jq -r '[(.pgbackrest // [])[] | select((.backup // []) | length == 0) | .name] | join(", ")' <<<"$data" 2>/dev/null || echo "")"

# Decide the verdict.
if [ "$count" -eq 0 ]; then
  status="skip";  message="no pgBackRest data"
elif [ -n "$notok" ]; then
  status="error"; message="$notok stanza not ok"
elif [ -n "$nobackup" ]; then
  status="warn";  message="$nobackup has no backups yet"
else
  status="ok";    message="$count stanza(s) ok with backups"
fi

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  '{check: $check, status: $status, message: $message}'
