#!/usr/bin/env bash
#
# <name>.local.sh — run this triage workflow on a developer's machine: the shell equivalent of
# the n8n workflow JSON this skill builds. Same stages, same read-only / idempotent contract.
#
#   n8n node                   local equivalent (below)
#   ------------------------   --------------------------------------------------------------
#   Webhook (params)        →  CLI args / env (NAMESPACE, ...)
#   Execute-Command chain   →  run each cleaned snippet-*, collect its JSON (read-only)
#   Code: Format (markdown) →  merge the JSON (jq -s add), render the report via render.sh
#   Markdown → HTML         →  view.sh : write the HTML page to /tmp
#   Respond to Webhook      →  view.sh prints a file:// URL — open it in a browser
#
# Copy to tools/n8n/workflows/<name>.local.sh next to <name>.json, then fill the <-- markers.
# Shellcheck it before signing off.
#
# Usage:  NAMESPACE=f208ae-dev ./<name>.local.sh     # prints a file:// URL to open in a browser
set -euo pipefail

# Resolve the repo root from this script's location (it lives in tools/n8n/workflows/).
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
N8N="$ROOT/tools/n8n"
GROUP="crunchy-triage"                              # <-- snippets/<group>
SNIPPETS="$N8N/snippets/$GROUP"
REPORT="$SNIPPETS/snippet-triage-report.md"         # <-- the cleaned markdown report template
NAME="crunchy-triage"                               # <-- page name (/tmp/n8n-report/NAME.html)

# --- Inputs (the webhook params) -------------------------------------------------------
: "${NAMESPACE:?set NAMESPACE (the triage target, e.g. f208ae-dev)}"

# --- Collect: one read-only snippet per step; each prints a JSON object on stdout -------
# The Execute-Command chain. Add/remove a line per cleaned collection snippet, in order.
# `|| true` keeps a failing step from aborting the run — its data is just absent, and the
# report (guarded with {{#if}}) renders whatever did arrive.
parts=()
parts+=("$(NAMESPACE="$NAMESPACE" bash "$SNIPPETS/snippet-cluster-status.sh" 2>/dev/null || true)")
parts+=("$(NAMESPACE="$NAMESPACE" bash "$SNIPPETS/snippet-pgbackrest-info.sh" 2>/dev/null || true)")

# --- Format: merge the JSON objects into one (later keys win) ---------------------------
merged="$(printf '%s\n' "${parts[@]}" | jq -s 'add // {}')"

# --- Render → HTML → open (the Format → Markdown → Respond tail) ------------------------
printf '%s' "$merged" | NAMESPACE="$NAMESPACE" bash "$N8N/render.sh" "$REPORT" \
  | bash "$N8N/view.sh" "$NAME"
