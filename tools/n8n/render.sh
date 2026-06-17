#!/usr/bin/env bash
#
# render.sh — render a Markdown template, filling three kinds of placeholder:
#
#   {{ .json.path }}      resolved with jq from JSON on stdin (structured/tabular data)
#   ${VAR}                resolved from the environment (scalars)
#   {{#if EXPR }} ...      block conditional: keep the enclosed lines only when EXPR is
#   [{{else}}] {{/if}}     "present" (non-null, non-empty array/object/string). Markers each
#                          go on their own line; blocks nest. `present` is exposed for use in
#                          EXPR, so combine keys: {{#if (.a|present) or (.b|present) }}.
#
# The conditional makes a report self-degrading: each section is guarded by its own data, so
# it stays clean no matter which upstream nodes ran — or none (use {{else}} for a fallback).
#
# All passes run, so a template may mix them. Works standalone and inside an n8n
# Execute-Command node (pipe the upstream node's JSON in on stdin).
#
# Depends only on bash + jq (already in the n8n image). It does NOT touch bare `$FOO`
# or a lone `$`, so shell-looking text in the template is left alone — only the
# braced `${VAR}` form is substituted.
#
# Examples:
#   echo '{"leader":"db-ffcs-0"}' | ./render.sh status.md
#   LAG=0 ./render.sh status.md < cluster.json
#   ./render.sh status.md            # no stdin: conditionals drop, {{ }} empty, ${VAR} from env

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: render.sh TEMPLATE.md

Renders TEMPLATE.md to stdout, substituting:
  {{ .json.path }}       from JSON on stdin via jq (e.g. {{ .cluster.leader }})
  ${VAR}                 from the environment
  {{#if EXPR }}…{{/if}}  keep the block only if EXPR is present (optional {{else}})

Options:
  -h, --help   Show this help

Notes:
  - JSON is read from stdin when stdin is not a terminal.
  - A {{ }} expression that errors or is missing resolves to an empty string.
  - {{#if}}/{{else}}/{{/if}} markers each go on their own line and may nest; a block whose
    EXPR is absent (or with no stdin) is dropped, so reports degrade gracefully.
  - Only ${VAR} (braced) is substituted; bare $FOO and $ are left untouched.
EOF
}

TEMPLATE=""
for arg in "$@"; do
  case "$arg" in
    -h | --help)
      usage
      exit 0
      ;;
    -*)
      echo "Unknown argument: $arg" >&2
      usage >&2
      exit 1
      ;;
    *)
      if [[ -n "$TEMPLATE" ]]; then
        echo "Error: more than one template given" >&2
        exit 1
      fi
      TEMPLATE="$arg"
      ;;
  esac
done

if [[ -z "$TEMPLATE" ]]; then
  echo "Error: no template given" >&2
  usage >&2
  exit 1
fi
if [[ ! -f "$TEMPLATE" ]]; then
  echo "Error: template not found: $TEMPLATE" >&2
  exit 1
fi
command -v jq >/dev/null 2>&1 || { echo "Error: jq is required" >&2; exit 1; }

# Read JSON from stdin only when it's piped/redirected (not an interactive terminal).
JSON=""
if [[ ! -t 0 ]]; then
  JSON="$(cat)"
fi

content="$(cat "$TEMPLATE")"

# Pass 0 — block conditionals: {{#if EXPR}} ... [{{else}}] ... {{/if}} (own-line markers,
# nestable). A block renders only when EXPR is "present": non-null, non-false, non-empty
# string, and a non-empty array/object. `present` is exposed for use inside EXPR (combine keys
# with or/and), so a report shows only the sections whose data arrived — and nothing broken
# when none did.
present_def='def present: (.!=null) and (.!=false) and (.!="") and (if (type=="array" or type=="object") then (length>0) else true end);'
cond=()   # 1/0 per open block: is this branch active? (AND of the whole stack = emit)
took=()   # 1/0 per open block: was the if-branch condition true? (so {{else}} can invert it)
emitting() { local c; for c in ${cond[@]+"${cond[@]}"}; do [[ "$c" == 1 ]] || return 1; done; return 0; }
out=""
while IFS= read -r line || [[ -n "$line" ]]; do
  if [[ "$line" =~ ^[[:space:]]*\{\{#if[[:space:]]+(.+)\}\}[[:space:]]*$ ]]; then
    if [[ -n "$JSON" ]] && jq -e "$present_def ( ${BASH_REMATCH[1]} ) | present" >/dev/null 2>&1 <<<"$JSON"; then
      took+=(1); cond+=(1)
    else
      took+=(0); cond+=(0)
    fi
    continue
  fi
  if [[ "$line" =~ ^[[:space:]]*\{\{else\}\}[[:space:]]*$ ]]; then
    if (( ${#cond[@]} )); then i=$(( ${#cond[@]} - 1 )); cond[$i]=$(( 1 - took[i] )); fi
    continue
  fi
  if [[ "$line" =~ ^[[:space:]]*\{\{/if\}\}[[:space:]]*$ ]]; then
    if (( ${#cond[@]} )); then unset "cond[$(( ${#cond[@]} - 1 ))]" "took[$(( ${#took[@]} - 1 ))]"; fi
    continue
  fi
  if emitting; then out+="$line"$'\n'; fi
done <<<"$content"
content="${out%$'\n'}"

# Pass A — {{ .json.path }} via jq. Collect every distinct placeholder from the template, evaluate
# them all in ONE jq pass (fast on any payload size), then substitute. Substituted values are NOT
# re-scanned, so data that happens to contain "{{ }}" can never trigger a loop or be re-evaluated.
ph_wholes=(); ph_exprs=()
declare -A ph_seen
scan="$content"
while [[ "$scan" =~ \{\{[[:space:]]*([^}]+[^}[:space:]])[[:space:]]*\}\} ]]; do
  w="${BASH_REMATCH[0]}"; e="${BASH_REMATCH[1]}"
  if [[ -z "${ph_seen[$w]+x}" ]]; then ph_seen["$w"]=1; ph_wholes+=("$w"); ph_exprs+=("$e"); fi
  scan="${scan//"$w"/}"
done
ph_vals=()
if [[ -n "$JSON" && ${#ph_exprs[@]} -gt 0 ]]; then
  prog=""
  for e in "${ph_exprs[@]}"; do prog+="(try ($e) catch null),"; done
  prog="[ ${prog%,} ] | .[] | (if . == null then \"\" elif type == \"string\" then . else tojson end) + \"\u0000\""
  while IFS= read -r -d '' v; do ph_vals+=("$v"); done < <(jq -j "$prog" <<<"$JSON" 2>/dev/null)
fi
for ((i = 0; i < ${#ph_wholes[@]}; i++)); do
  content="${content//"${ph_wholes[i]}"/${ph_vals[i]-}}"
done

# Pass B — ${VAR} from the environment (braced form only). Collected once; values are not
# re-scanned, so data that happens to contain "${...}" is left as-is.
var_names=()
declare -A var_seen
scan="$content"
while [[ "$scan" =~ \$\{([A-Za-z_][A-Za-z0-9_]*)\} ]]; do
  v="${BASH_REMATCH[1]}"
  if [[ -z "${var_seen[$v]+x}" ]]; then var_seen["$v"]=1; var_names+=("$v"); fi
  scan="${scan//"\${$v}"/}"
done
for v in "${var_names[@]+"${var_names[@]}"}"; do
  content="${content//"\${$v}"/${!v-}}"
done

printf '%s\n' "$content"
