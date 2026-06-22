#!/usr/bin/env bash
# validator-pg-cache — read-only verdict on the Postgres buffer-cache hit ratio.
#
# Cleaned from postgres-triage (a validator).
# Input:     stdin JSON — the merged collection output (reads .cache; tolerates absence).
# Read-only: a pure check over the collected JSON; no db access. Idempotent.
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

CHECK="cache"
data="$(cat)"; data="${data:-null}"

# Extract the hit ratio (float for the message, floored int for the comparison).
ratio="$(jq -r '.cache.hit_ratio_pct // empty' <<<"$data" 2>/dev/null || echo "")"
ratio_int="$(jq -r '(.cache.hit_ratio_pct // 100) | floor' <<<"$data" 2>/dev/null || echo 100)"

# Decide the verdict.
if [[ -z "$ratio" ]]; then
  status="skip";  message="no cache data"
elif [[ "$ratio_int" -lt 90 ]]; then
  status="warn";  message="cache hit ratio ${ratio}% is low (< 90%)"
else
  status="ok";    message="cache hit ratio ${ratio}%"
fi

# Docs link for the concept (looked up in the shim) + the pod this data came from.
docs="$(doc_url cache "${PG_VERSION:-17}" 2>/dev/null || true)"
src="$(jq -r '.primary_pod // empty' <<<"$data" 2>/dev/null || echo "")"

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  --arg docs "$docs" --arg src "$src" \
  '{check: $check, status: $status, message: $message, docs: $docs,
    sources: (if $src == "" then [] else ["pod/" + $src] end)}'
