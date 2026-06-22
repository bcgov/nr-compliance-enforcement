#!/usr/bin/env bash
# validator-cluster-status — read-only verdict on the crunchy/patroni cluster state.
#
# Cleaned from crunchy-dr-wiki (a validator: validation kept separate from fetching).
# Input:     stdin JSON — the merged collection output (reads .members; tolerates absence).
# Read-only: a pure check over the collected JSON; no cluster access. Idempotent.
# Output:    stdout JSON { check, status, message, docs, sources } (status ok|warn|error|skip).
set -euo pipefail

# Load shared libs: messaging (utils.sh, two dirs up) + this group's doc-link shim — a sibling
# url-shim-<group>.sh generated from config.yaml (separator matches the group's; a static URL
# table, so lookups need no yq/config at run time). Both optional — the verdict still emits.
HERE="$(cd "$(dirname "$0")" && pwd)"; GROUP="$(basename "$HERE")"
case "$GROUP" in *_*) SEP=_ ;; *) SEP=- ;; esac
# shellcheck source=/dev/null
. "$HERE/../../utils.sh" 2>/dev/null || true
# shellcheck source=/dev/null
. "$HERE/url${SEP}shim${SEP}${GROUP}.sh" 2>/dev/null || true

CHECK="cluster"
data="$(cat)"; data="${data:-null}"

# Extract the values we check.
members="$(jq -r '(.members // []) | length' <<<"$data" 2>/dev/null || echo 0)"
leaders="$(jq -r '[(.members // [])[] | select(.Role == "Leader")] | length' <<<"$data" 2>/dev/null || echo 0)"
unhealthy="$(jq -r '[(.members // [])[] | select(.State != "running" and .State != "streaming") | .Member] | join(", ")' <<<"$data" 2>/dev/null || echo "")"

# Decide the verdict.
if [[ "$members" -eq 0 ]]; then
  status="skip";  message="no cluster member data"
elif [[ "$leaders" -eq 0 ]]; then
  status="error"; message="no leader elected"
elif [[ -n "$unhealthy" ]]; then
  status="warn";  message="$unhealthy not running/streaming"
else
  status="ok";    message="leader present; $members member(s) healthy"
fi

# Docs link for the concept (looked up in the shim) + the pod this data came from.
docs="$(doc_url cluster-ha "${PG_VERSION:-17}" 2>/dev/null || true)"
src="$(jq -r '.primary_pod // empty' <<<"$data" 2>/dev/null || echo "")"

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  --arg docs "$docs" --arg src "$src" \
  '{check: $check, status: $status, message: $message, docs: $docs,
    sources: (if $src == "" then [] else ["pod/" + $src] end)}'
