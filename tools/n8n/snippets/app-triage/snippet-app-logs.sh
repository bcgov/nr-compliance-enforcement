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
#          MAXLINES (env, default 200) — cap the stored lines (a label can match many pods, so
#                     LINES is per pod); line_count still reports the true total collected.
# Read-only: oc get pods + oc logs only; idempotent, safe to re-run any time.
# Output:    stdout JSON { "<shortname>_logs": { service, namespace, selector, since, tail,
#            pods, pod_count, lines, line_count } } — keyed by service so a flat merge keeps
#            every service's logs (and its errors) as a distinct top-level key.
set -euo pipefail

NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"
SHORT="${2:-${SHORTNAME:?set SHORTNAME or pass it as arg 2 (app.kubernetes.io/short-name)}}"
LINES="${LINES:-50}"
SINCE="${SINCE:-1h}"
MAXLINES="${MAXLINES:-200}"
SELECTOR="app.kubernetes.io/short-name=$SHORT"

# Pods backing the service (for the source list + availability); read-only. -o name -> "pod/<n>".
pods="$(oc get pods -n "$NS" -l "$SELECTOR" -o name 2>/dev/null | sed 's#^pod/##' || true)"
pods_json="$(printf '%s' "$pods" | jq -Rsc 'split("\n") | map(select(length > 0))' 2>/dev/null || echo '[]')"

# Recent logs across all matching pods/containers; --since/--tail bound the volume. Read-only.
logs="$(oc logs -n "$NS" -l "$SELECTOR" --all-containers --prefix --tail="$LINES" --since="$SINCE" 2>/dev/null || true)"

# Strip ANSI colour codes (NestJS etc. emit them) for a readable report, then assemble the JSON by
# piping the (possibly large) text through jq on STDIN — passing it via --argjson would overflow the
# command-line length limit on chatty services. line_count is the true total; lines is the last
# MAXLINES so the payload stays bounded through the n8n base64 transport.
key="${SHORT}_logs"
printf '%s' "$logs" \
  | sed $'s/\x1b\\[[0-9;]*m//g' \
  | jq -Rs --arg key "$key" --arg svc "$SHORT" --arg ns "$NS" --arg sel "$SELECTOR" \
        --arg since "$SINCE" --argjson tail "$LINES" --argjson max "$MAXLINES" \
        --argjson pods "$pods_json" \
    '(split("\n") | map(select(length > 0))) as $all
     | ($all | length) as $n
     | (if $n > $max then ($all | .[-$max:]) else $all end) as $lines
     | { ($key): { service: $svc, namespace: $ns, selector: $sel, since: $since, tail: $tail,
                   pods: $pods, pod_count: ($pods | length),
                   lines: $lines, line_count: $n } }'
