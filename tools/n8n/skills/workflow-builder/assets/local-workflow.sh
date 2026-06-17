#!/usr/bin/env bash
#
# <name>.local.sh — run this workflow on a developer's machine: the shell equivalent of the n8n
# workflow JSON this skill builds. Same stages, same read-only / idempotent contract; it writes an
# HTML report to /tmp and prints a file:// URL to open.
#
#   n8n node                       local stage (below)
#   ----------------------------   ---------------------------------------------------------------
#   Webhook (params)            →  whatever env the snippets read (set on the command line)
#   Execute-Command (collect)   →  run each collection snippet-*, merge its JSON (read-only)
#   Execute-Command (validate)  →  run each validator-* on the merged JSON, key verdicts by .check
#   Code: Format → Markdown     →  render the report via render.sh
#   Markdown → HTML, Respond     →  view.sh: write the HTML page to /tmp, print a file:// URL
#
# Copy to tools/n8n/workflows/<name>.local.sh next to <name>.json, fill the <-- markers, and
# shellcheck it. Progress goes to stderr (>&2) so it never mixes into the JSON on stdout.
#
# Usage:  <ENV>=<value> ./<name>.local.sh        # prints a file:// URL to open in a browser
set -euo pipefail

# Resolve the repo root from this script's location (it lives in tools/n8n/workflows/).
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
N8N="$ROOT/tools/n8n"
GROUP="<group>"                                # <-- snippets/<group>
SNIPPETS="$N8N/snippets/$GROUP"
REPORT="$SNIPPETS/<report>.md"                 # <-- the cleaned report template
NAME="<name>"                                  # <-- page name (/tmp/n8n-report/NAME.html)

# Inputs: the snippets read whatever env they need (each documents its params); child processes
# inherit this script's environment, so just run them. Optionally require one up front, e.g.:
#   : "${SOME_PARAM:?set SOME_PARAM}"

# --- Collect: each collection snippet prints a JSON object; merge them. `|| true` keeps a failing
#     step from aborting the run — its data is just absent, and the report (guarded with {{#if}})
#     renders whatever did arrive.
collect=("<collection-snippet>" "<collection-snippet>")   # <-- the cleaned collection snippets, in order
echo "collecting..." >&2
parts=()
for s in "${collect[@]}"; do
  echo "  - $s" >&2
  parts+=("$(bash "$SNIPPETS/$s.sh" 2>/dev/null || true)")
done
merged="$(printf '%s\n' "${parts[@]}" | jq -s 'add // {}')"

# --- Validate (optional): each validator reads the merged JSON and emits { check, status, message };
#     key the verdicts by .check into .validations. Leave the list empty to skip.
validators=()                                  # <-- the cleaned validator-* snippets, if any
echo "validating..." >&2
verdicts=()
for v in "${validators[@]+"${validators[@]}"}"; do
  echo "  - $v" >&2
  verdicts+=("$(printf '%s' "$merged" | bash "$SNIPPETS/$v.sh" 2>/dev/null || true)")
done
validations="$(printf '%s\n' "${verdicts[@]+"${verdicts[@]}"}" | jq -s 'map(select(type == "object" and has("check"))) | map({(.check): .}) | add // {}')"
final="$(printf '%s' "$merged" | jq --argjson v "$validations" '. + {validations: $v}')"

# --- Render → HTML → open. To chain another report below this one, render that report first and
#     pass its output as .previous (see references/LOCAL_WORKFLOW.md); otherwise render the one.
echo "rendering report..." >&2
printf '%s' "$final" | bash "$N8N/render.sh" "$REPORT" | bash "$N8N/view.sh" "$NAME"
