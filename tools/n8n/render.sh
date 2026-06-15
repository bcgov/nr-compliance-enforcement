#!/usr/bin/env bash
#
# render.sh — render a Markdown template, filling two kinds of placeholder:
#
#   {{ .json.path }}   resolved with jq from JSON on stdin (structured/tabular data)
#   ${VAR}             resolved from the environment (scalars)
#
# Both passes run, so a template may mix them. Works standalone and inside an n8n
# Execute-Command node (pipe the upstream node's JSON in on stdin).
#
# Depends only on bash + jq (already in the n8n image). It does NOT touch bare `$FOO`
# or a lone `$`, so shell-looking text in the template is left alone — only the
# braced `${VAR}` form is substituted.
#
# Examples:
#   echo '{"leader":"db-ffcs-0"}' | ./render.sh status.md
#   LAG=0 ./render.sh status.md < cluster.json
#   ./render.sh status.md            # no stdin: {{ }} resolve to empty, ${VAR} from env

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: render.sh TEMPLATE.md

Renders TEMPLATE.md to stdout, substituting:
  {{ .json.path }}   from JSON on stdin via jq (e.g. {{ .cluster.leader }})
  ${VAR}             from the environment

Options:
  -h, --help   Show this help

Notes:
  - JSON is read from stdin when stdin is not a terminal.
  - A {{ }} expression that errors or is missing resolves to an empty string.
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

# Pass A — {{ .json.path }} via jq. Each distinct placeholder is evaluated once and
# all of its occurrences replaced.
while [[ "$content" =~ \{\{[[:space:]]*([^}]+[^}[:space:]])[[:space:]]*\}\} ]]; do
  whole="${BASH_REMATCH[0]}"
  expr="${BASH_REMATCH[1]}"
  if [[ -n "$JSON" ]]; then
    val="$(jq -r "$expr" <<<"$JSON" 2>/dev/null || true)"
  else
    val=""
  fi
  content="${content//"$whole"/$val}"
done

# Pass B — ${VAR} from the environment (braced form only).
while [[ "$content" =~ \$\{([A-Za-z_][A-Za-z0-9_]*)\} ]]; do
  var="${BASH_REMATCH[1]}"
  val="${!var-}"
  content="${content//"\${$var}"/$val}"
done

printf '%s\n' "$content"
