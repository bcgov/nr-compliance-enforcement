#!/usr/bin/env bash
# validator-app-availability — read-only verdict on whether each app service is up and logging.
#
# Cleaned from nr-ce-app-triage (a validator).
# Input:     stdin JSON — the merged collection output (reads the *_logs entries; tolerates absence).
# Read-only: a pure check over the collected JSON; no cluster access. Idempotent.
# Output:    stdout JSON { check, status, message, docs, sources } (status ok|warn|error|skip).
set -euo pipefail

# Load shared libs: messaging (utils.sh, two dirs up) + this group's doc-link shim — a sibling
# url-shim-<group>.sh generated from config.yaml (a static URL table, so lookups need no yq/config
# at run time). Both optional — the verdict still emits without them.
HERE="$(cd "$(dirname "$0")" && pwd)"; GROUP="$(basename "$HERE")"
case "$GROUP" in *_*) SEP=_ ;; *) SEP=- ;; esac
# shellcheck source=/dev/null
. "$HERE/../../utils.sh" 2>/dev/null || true
# shellcheck source=/dev/null
. "$HERE/url${SEP}shim${SEP}${GROUP}.sh" 2>/dev/null || true

CHECK="availability"
data="$(cat)"; data="${data:-null}"

# Extract: how many services reported logs, which have no running pods, which are pod-up but silent.
svc_count="$(jq -r '[to_entries[] | select(.key | endswith("_logs"))] | length' <<<"$data" 2>/dev/null || echo 0)"
down="$(jq -r '[to_entries[] | select(.key | endswith("_logs")) | .value | select((.pod_count // 0) == 0) | .service] | join(", ")' <<<"$data" 2>/dev/null || echo "")"
quiet="$(jq -r '[to_entries[] | select(.key | endswith("_logs")) | .value | select((.pod_count // 0) > 0 and (.line_count // 0) == 0) | .service] | join(", ")' <<<"$data" 2>/dev/null || echo "")"

# Decide the verdict.
if [[ "$svc_count" -eq 0 ]]; then
  status="skip";  message="no log data to validate"
elif [[ -n "$down" ]]; then
  status="error"; message="no running pods for: $down"
elif [[ -n "$quiet" ]]; then
  status="warn";  message="pods up but no recent logs for: $quiet"
else
  status="ok";    message="$svc_count service(s) up and logging"
fi

# Docs link for the concept (looked up in the shim) + the deployments this verdict covers.
docs="$(doc_url workloads latest 2>/dev/null || true)"
src="$(jq -c '[to_entries[] | select(.key | endswith("_logs")) | .value.service | "deployment/" + .]' <<<"$data" 2>/dev/null || echo '[]')"

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  --arg docs "$docs" --argjson sources "${src:-[]}" \
  '{check: $check, status: $status, message: $message, docs: $docs, sources: $sources}'
