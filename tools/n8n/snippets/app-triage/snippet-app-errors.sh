#!/usr/bin/env bash
# snippet-app-errors — read-only recent ERROR-pattern log lines for one app deployment as JSON.
#
# Cleaned from nr-ce-app-triage (hand-authored read-only OpenShift log collection).
# Params:  NAMESPACE (env or $1, required) — OpenShift namespace.
#          SHORTNAME (env or $2, required) — the app.kubernetes.io/short-name value (backend, ...).
#          LINES (env, default 50)     — tail this many log lines per matching pod before filtering.
#          SINCE (env, default 1h)     — only logs newer than this (oc logs --since).
#          PATTERNS (env, default below) — extended-regex of error markers, matched case-insensitively.
#          MAXLINES (env, default 200) — cap the stored matches; match_count reports the true total.
# Read-only: oc logs + grep over the fetched text; idempotent, safe to re-run any time.
# Output:    stdout JSON { "<shortname>_errors": { service, namespace, selector, since, tail,
#            patterns, matches, match_count } } — keyed by service for a clean flat merge.
set -euo pipefail

NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"
SHORT="${2:-${SHORTNAME:?set SHORTNAME or pass it as arg 2 (app.kubernetes.io/short-name)}}"
LINES="${LINES:-50}"
SINCE="${SINCE:-1h}"
MAXLINES="${MAXLINES:-200}"
PATTERNS="${PATTERNS:-error|fatal|exception|panic|traceback|unhandled|ECONN|ETIMEDOUT|timed out|HTTP 5[0-9][0-9]}"
SELECTOR="app.kubernetes.io/short-name=$SHORT"

# Fetch the same bounded log window, strip ANSI colour codes, then keep only error-ish lines
# (case-insensitive ERE). grep exits 1 when nothing matches — tolerate it so "no errors" is an
# empty list, not a failure.
logs="$(oc logs -n "$NS" -l "$SELECTOR" --all-containers --prefix --tail="$LINES" --since="$SINCE" 2>/dev/null || true)"
matched="$(printf '%s' "$logs" | sed $'s/\x1b\\[[0-9;]*m//g' | grep -iE "$PATTERNS" 2>/dev/null || true)"

# Assemble via jq on STDIN (a noisy service can match far more than the command line can carry);
# match_count is the true total, matches is the last MAXLINES so the payload stays bounded.
key="${SHORT}_errors"
printf '%s' "$matched" \
  | jq -Rs --arg key "$key" --arg svc "$SHORT" --arg ns "$NS" --arg sel "$SELECTOR" \
        --arg since "$SINCE" --argjson tail "$LINES" --argjson max "$MAXLINES" \
        --arg patterns "$PATTERNS" \
    '(split("\n") | map(select(length > 0))) as $all
     | ($all | length) as $n
     | (if $n > $max then ($all | .[-$max:]) else $all end) as $matches
     | { ($key): { service: $svc, namespace: $ns, selector: $sel, since: $since, tail: $tail,
                   patterns: $patterns, matches: $matches, match_count: $n } }'
