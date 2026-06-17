#!/usr/bin/env bash
# validator-pgbackrest — read-only verdict on pgBackRest backup state.
#
# Cleaned from crunchy-dr-wiki (a validator: validation kept separate from fetching).
# Input:     stdin JSON — the merged collection output (reads .pgbackrest; tolerates absence).
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

# pgBackRest is its own product, so its docs are not Postgres-version-pinned (use "latest").
docs="$(doc_url pgbackrest latest 2>/dev/null || true)"
src="$(jq -r '.repo_pod // empty' <<<"$data" 2>/dev/null || echo "")"

jq -n --arg check "$CHECK" --arg status "$status" --arg message "$message" \
  --arg docs "$docs" --arg src "$src" \
  '{check: $check, status: $status, message: $message, docs: $docs,
    sources: (if $src == "" then [] else ["pod/" + $src] end)}'
