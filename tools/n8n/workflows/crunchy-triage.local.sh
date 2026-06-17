#!/usr/bin/env bash
#
# crunchy-triage.local.sh — run the crunchy-triage workflow on a developer's machine: the shell
# equivalent of tools/n8n/workflows/crunchy-triage.json. Same stages, read-only + idempotent.
#
#   Webhook params          -> NAMESPACE (env)
#   Execute-Command chain   -> snippet-cluster-status.sh, snippet-pgbackrest-info.sh (collect JSON)
#   Code: Format -> Markdown -> jq merge -> render.sh snippet-triage-report.md
#   Markdown -> HTML + Respond -> view.sh (HTML in /tmp, prints a file:// URL)
#
#   NAMESPACE=f208ae-dev tools/n8n/workflows/crunchy-triage.local.sh    # prints a file:// URL to open
set -euo pipefail

# Resolve the repo root from this script's location (it lives in tools/n8n/workflows/).
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
N8N="$ROOT/tools/n8n"
SNIPPETS="$N8N/snippets/crunchy-triage"
REPORT="$SNIPPETS/snippet-triage-report.md"
NAME="crunchy-triage"

# --- Inputs (the webhook params) -------------------------------------------------------
: "${NAMESPACE:?set NAMESPACE (the triage target, e.g. f208ae-dev)}"

# --- Collect: one read-only snippet per step; each prints a JSON object on stdout -------
# `|| true` keeps a failing step from aborting the run — its data is just absent, and the
# report (guarded with {{#if}}) renders whatever did arrive.
parts=()
parts+=("$(NAMESPACE="$NAMESPACE" bash "$SNIPPETS/snippet-cluster-status.sh" 2>/dev/null || true)")
parts+=("$(NAMESPACE="$NAMESPACE" bash "$SNIPPETS/snippet-pgbackrest-info.sh" 2>/dev/null || true)")

# --- Format: merge the JSON objects into one (later keys win) ---------------------------
merged="$(printf '%s\n' "${parts[@]}" | jq -s 'add // {}')"

# --- Render -> HTML -> open (the Format -> Markdown -> Respond tail) --------------------
printf '%s' "$merged" | NAMESPACE="$NAMESPACE" bash "$N8N/render.sh" "$REPORT" \
  | bash "$N8N/view.sh" "$NAME"
