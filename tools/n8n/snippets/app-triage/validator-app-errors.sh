#!/usr/bin/env bash
# validator-app-errors — read-only verdict on error-pattern volume across the app services.
#
# Cleaned from nr-ce-app-triage (a validator).
# Input:     stdin JSON — the merged collection output (reads the *_errors entries; tolerates absence).
# Read-only: a pure check over the collected JSON; no cluster access. Idempotent.
# Output:    stdout JSON { check, status, message, docs, sources } (status ok|warn|error|skip).
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"; GROUP="$(basename "$HERE")"
case "$GROUP" in *_*) SEP=_ ;; *) SEP=- ;; esac
# shellcheck source=/dev/null
. "$HERE/../../utils.sh" 2>/dev/null || true
# shellcheck source=/dev/null
. "$HERE/url${SEP}shim${SEP}${GROUP}.sh" 2>/dev/null || true

CHECK="errors"
HIGH="${ERROR_HIGH:-25}"   # per-service match count at/above which the verdict escalates to error
data="$(cat)"; data="${data:-null}"

# Extract: services reporting, total matches, the hot ones (>= HIGH), and any with matches at all.
svc_count="$(jq -r '[to_entries[] | select(.key | endswith("_errors"))] | length' <<<"$data" 2>/dev/null || echo 0)"
total="$(jq -r '[to_entries[] | select(.key | endswith("_errors")) | .value.match_count // 0] | add // 0' <<<"$data" 2>/dev/null || echo 0)"
hot="$(jq -r --argjson hi "$HIGH" '[to_entries[] | select(.key | endswith("_errors")) | .value | select((.match_count // 0) >= $hi) | "\(.service) (\(.match_count))"] | join(", ")' <<<"$data" 2>/dev/null || echo "")"
withany="$(jq -r '[to_entries[] | select(.key | endswith("_errors")) | .value | select((.match_count // 0) > 0) | "\(.service) (\(.match_count))"] | join(", ")' <<<"$data" 2>/dev/null || echo "")"

# Decide the verdict.
if [[ "$svc_count" -eq 0 ]]; then
  status="skip";  message="no error data to validate"
elif [[ -n "$hot" ]]; then
  status="error"; message="high error volume: $hot"
elif [[ "$total" -gt 0 ]]; then
  status="warn";  message="error-pattern lines seen: $withany"
else
  status="ok";    message="no error-pattern lines in the collected logs"
fi

# Docs link for the concept (looked up in the shim) + the services with matches.
docs="$(doc_url logging latest 2>/dev/null || true)"
src="$(jq -c '[to_entries[] | select(.key | endswith("_errors")) | .value | select((.match_count // 0) > 0) | .service | "deployment/" + .]' <<<"$data" 2>/dev/null || echo '[]')"

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  --arg docs "$docs" --argjson sources "${src:-[]}" \
  '{check: $check, status: $status, message: $message, docs: $docs, sources: $sources}'
