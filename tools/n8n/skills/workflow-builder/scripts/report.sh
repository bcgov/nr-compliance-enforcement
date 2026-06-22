#!/usr/bin/env bash
# report.sh <group> <report.md>... — assemble the final triage payload and render the report(s),
# so the n8n "report" node stays a thin one-line call. Inputs come base64-encoded in the
# environment (so they survive being passed through an n8n shell command intact):
#   DATA   the merged collection JSON   (from merge.sh)
#   VALS   the keyed validations JSON   (from merge.sh -k)
# It builds  final = DATA + { validations: VALS }  and renders each <report.md> from final,
# chaining each as the next report's .previous (the FIRST arg ends up on top). Echoes the markdown.
# NAMESPACE (and any other env the reports read) is inherited from the caller.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=tools/n8n/utils.sh
. "$HERE/utils.sh" 2>/dev/null || true

GROUP="${1:?usage: report.sh <group> <report.md>...}"
shift
SNIPPETS="$HERE/snippets/$GROUP"

# base64 env value -> one compact JSON value on stdout ("{}" if absent/garbage).
dec() {
  local o
  o="$(printf '%s' "${1:-}" | base64 -d 2>/dev/null | jq -c . 2>/dev/null)"
  [ -n "$o" ] || o='{}'
  printf '%s\n' "$o"
}
# Stream both decoded values into one jq -s (DATA then VALS) and combine — piped via stdin, never on
# the command line, so a large merged payload (chatty log/triage output) can't overflow the arg-length
# limit (notably small on Git Bash/Windows).
final="$({ dec "${DATA:-}"; dec "${VALS:-}"; } | jq -sc '(.[0] // {}) + {validations: (.[1] // {})}')"

prev=""
args=("$@")
# Render in reverse so the first report arg is the outermost (top of the page); each earlier
# report wraps the rest in via its {{#if .previous}} block.
for ((i = ${#args[@]} - 1; i >= 0; i--)); do
  if [ -n "$prev" ]; then
    payload="$(printf '%s' "$final" | jq -c --arg p "$prev" '. + {previous: $p}')"
  else
    payload="$final"
  fi
  prev="$(printf '%s' "$payload" | bash "$HERE/render.sh" "$SNIPPETS/${args[i]}")"
done
printf '%s\n' "$prev"
