#!/usr/bin/env bash
# snippet-app-errors — read-only recent ERROR-pattern log lines for one app deployment as JSON.
#
# Cleaned from nr-ce-app-triage (hand-authored read-only OpenShift log collection).
# Params:  NAMESPACE (env or $1, required) — OpenShift namespace.
#          SHORTNAME (env or $2, required) — the app.kubernetes.io/short-name value (backend, ...).
#          LINES (env, default 50)     — tail this many log lines per matching pod before filtering.
#          SINCE (env, default 1h)     — only logs newer than this (oc logs --since).
#          PATTERNS (env, default below) — extended-regex of error markers, matched case-insensitively.
#          The stored matches are bounded by the GLOBAL TRIAGE_MAX_LINE / TRIAGE_MAX_BYTES caps
#          (see utils.sh clip_stream); match_count still reports the true total.
# Read-only: oc logs + grep over the fetched text; idempotent, safe to re-run any time.
# Output:    stdout JSON { "<shortname>_errors": { service, namespace, selector, since, tail,
#            patterns, matches, match_count } } — keyed by service for a clean flat merge.
set -euo pipefail

# Shared lib: clip_stream + the global TRIAGE_MAX_* output bounds (sibling utils.sh, two dirs up — same
# path locally and in the n8n image). Required: every field MUST be bounded before n8n carries it.
HERE="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=tools/n8n/utils.sh
. "$HERE/../../utils.sh" || { echo "snippet-app-errors: cannot source utils.sh (clip_stream)" >&2; exit 1; }

NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"
SHORT="${2:-${SHORTNAME:?set SHORTNAME or pass it as arg 2 (app.kubernetes.io/short-name)}}"
LINES="${LINES:-50}"
SINCE="${SINCE:-1h}"
PATTERNS="${PATTERNS:-error|fatal|exception|panic|traceback|unhandled|ECONN|ETIMEDOUT|timed out|HTTP 5[0-9][0-9]}"
SELECTOR="app.kubernetes.io/short-name=$SHORT"

# Fetch the same bounded log window, strip ANSI colour codes, then keep only error-ish lines
# (case-insensitive ERE). grep exits 1 when nothing matches — tolerate it so "no errors" is an
# empty list, not a failure.
logs="$(oc logs -n "$NS" -l "$SELECTOR" --all-containers --prefix --tail="$LINES" --since="$SINCE" 2>/dev/null || true)"
matched="$(printf '%s' "$logs" | sed $'s/\x1b\\[[0-9;]*m//g' | grep -iE "$PATTERNS" 2>/dev/null || true)"

# Truncate the matches with the shared clip_stream BEFORE they become JSON, so a noisy service — or a
# single megabyte-long matched line — can't bloat the field n8n carries as one base64 arg (E2BIG).
# Count the true total first (cheap, from the in-memory text — never passed as an arg) so the report
# can show the real match count; matches holds only the bounded tail.
key="${SHORT}_errors"
match_count="$(printf '%s\n' "$matched" | grep -c '[^[:space:]]' || true)"
printf '%s' "$matched" | clip_stream \
  | jq -Rs --arg key "$key" --arg svc "$SHORT" --arg ns "$NS" --arg sel "$SELECTOR" \
        --arg since "$SINCE" --argjson tail "$LINES" --arg patterns "$PATTERNS" \
        --argjson match_count "${match_count:-0}" \
    '{ ($key): { service: $svc, namespace: $ns, selector: $sel, since: $since, tail: $tail,
                 patterns: $patterns, matches: (split("\n") | map(select(length > 0))), match_count: $match_count } }'
