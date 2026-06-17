#!/usr/bin/env bash
# validator-pg-wal — read-only verdict on WAL archiving health.
#
# Cleaned from postgres-triage (a validator).
# Input:     stdin JSON — the merged collection output (reads .wal; tolerates absence).
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

CHECK="wal"
data="$(cat)"; data="${data:-null}"

# Extract the values we check.
has="$(jq -r '(. // {}) | has("wal")' <<<"$data" 2>/dev/null || echo false)"
failed="$(jq -r '.wal.archiver.failed // 0' <<<"$data" 2>/dev/null || echo 0)"

# Decide the verdict.
if [ "$has" != "true" ]; then
  status="skip";  message="no WAL data"
elif [ "$failed" -gt 0 ]; then
  status="error"; message="$failed WAL archive failure(s)"
else
  status="ok";    message="WAL archiving healthy"
fi

# Docs link for the concept (looked up in the shim) + the pod this data came from.
docs="$(doc_url wal-archiving "${PG_VERSION:-17}" 2>/dev/null || true)"
src="$(jq -r '.primary_pod // empty' <<<"$data" 2>/dev/null || echo "")"

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  --arg docs "$docs" --arg src "$src" \
  '{check: $check, status: $status, message: $message, docs: $docs,
    sources: (if $src == "" then [] else ["pod/" + $src] end)}'
