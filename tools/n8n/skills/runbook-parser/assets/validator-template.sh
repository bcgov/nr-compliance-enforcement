#!/usr/bin/env bash
# validator-NAME — read-only verdict over collected JSON: OK or an issue string.
#
# A validator checks the OUTPUT of collection snippet(s) and reports a status, so validation
# logic stays separate from fetching. Hand-authored or agent-produced, like cleaned snippets.
#
# Cleaned from SOURCE NAME (a validator).
# Input:     stdin JSON — the merged collection output. Read only the keys you check, and
#            TOLERATE missing data (emit status "skip" rather than failing).
# Read-only: a pure check; no cluster/db access. Idempotent, safe to re-run any time.
# Output:    stdout JSON { check, status, message }
#              check   = the report section this verdict sits next to (e.g. "cluster")
#              status  = ok | warn | error | skip   (skip = the data was not present)
#              message = an OK summary, or the issue string
set -euo pipefail

CHECK="SECTION"                 # <-- the report section key (.validations.<CHECK>)
data="$(cat)"; data="${data:-null}"

# 1. Extract what you check (one simple jq per value; the `// default` keeps it graceful when
#    the data is missing, and `2>/dev/null || echo …` guards against bad input).
count="$(jq -r '(.SOMEKEY // []) | length' <<<"$data" 2>/dev/null || echo 0)"
# bad="$(jq -r '[(.SOMEKEY // [])[] | select(.field != "good") | .name] | join(", ")' <<<"$data" 2>/dev/null || echo "")"

# 2. Decide status + message.
if [ "$count" -eq 0 ]; then
  status="skip";  message="no data to validate"
elif false; then
  status="error"; message="describe the problem"
elif false; then
  status="warn";  message="describe the warning"
else
  status="ok";    message="all good"
fi

# 3. Emit the verdict (jq -n escapes the strings safely).
jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  '{check: $check, status: $status, message: $message}'
