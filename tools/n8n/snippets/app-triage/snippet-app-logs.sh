#!/usr/bin/env bash
# snippet-app-logs — read-only recent logs for one app deployment as JSON.
#
# Cleaned from nr-ce-app-triage (hand-authored read-only OpenShift log collection).
# Params:  NAMESPACE (env or $1, required) — OpenShift namespace.
#          SHORTNAME (env or $2, required) — the app.kubernetes.io/short-name value identifying
#                     the service (e.g. backend, backendcm, frontend). No service is hardcoded —
#                     the caller (the workflow) passes which one.
#          LINES (env, default 50)     — tail this many log lines per matching pod.
#          SINCE (env, default 1h)     — only logs newer than this (oc logs --since).
#          The stored output is bounded by the GLOBAL TRIAGE_MAX_LINE / TRIAGE_MAX_BYTES caps
#          (see utils.sh clip_stream); line_count still reports the true total collected.
# Read-only: oc get pods + oc logs only; idempotent, safe to re-run any time.
# Output:    stdout JSON { "<shortname>_logs": { service, namespace, selector, since, tail,
#            pods, pod_count, lines, line_count } } — keyed by service so a flat merge keeps
#            every service's logs (and its errors) as a distinct top-level key.
set -euo pipefail

# Shared lib: clip_stream + the global TRIAGE_MAX_* output bounds (sibling utils.sh, two dirs up — same
# path locally and in the n8n image). Required: every field MUST be bounded before n8n carries it.
HERE="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=tools/n8n/utils.sh
. "$HERE/../../utils.sh" || { echo "snippet-app-logs: cannot source utils.sh (clip_stream)" >&2; exit 1; }

NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"
SHORT="${2:-${SHORTNAME:?set SHORTNAME or pass it as arg 2 (app.kubernetes.io/short-name)}}"
LINES="${LINES:-50}"
SINCE="${SINCE:-1h}"
SELECTOR="app.kubernetes.io/short-name=$SHORT"

# Pods backing the service (for the source list + availability); read-only. -o name -> "pod/<n>".
pods="$(oc get pods -n "$NS" -l "$SELECTOR" -o name 2>/dev/null | sed 's#^pod/##' || true)"
pods_json="$(printf '%s' "$pods" | jq -Rsc 'split("\n") | map(select(length > 0))' 2>/dev/null || echo '[]')"

# Recent logs across all matching pods/containers; --since/--tail bound the volume. Read-only. Strip
# ANSI colour codes (NestJS etc. emit them) up front so the line caps count visible characters.
logs="$(oc logs -n "$NS" -l "$SELECTOR" --all-containers --prefix --tail="$LINES" --since="$SINCE" 2>/dev/null \
        | sed $'s/\x1b\\[[0-9;]*m//g' || true)"

# Truncate the text with the shared clip_stream BEFORE it becomes JSON, so a chatty service or a
# single megabyte-long log line can't bloat the field n8n carries as one base64 arg (E2BIG). Count
# the true total first (cheap, from the in-memory text — never passed as an arg), so the report can
# still say "last N of <true total>"; lines holds only the bounded tail.
key="${SHORT}_logs"
line_count="$(printf '%s\n' "$logs" | grep -c '[^[:space:]]' || true)"
printf '%s' "$logs" | clip_stream \
  | jq -Rs --arg key "$key" --arg svc "$SHORT" --arg ns "$NS" --arg sel "$SELECTOR" \
        --arg since "$SINCE" --argjson tail "$LINES" --argjson pods "$pods_json" \
        --argjson line_count "${line_count:-0}" \
    '{ ($key): { service: $svc, namespace: $ns, selector: $sel, since: $since, tail: $tail,
                 pods: $pods, pod_count: ($pods | length),
                 lines: (split("\n") | map(select(length > 0))), line_count: $line_count } }'
