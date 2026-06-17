#!/usr/bin/env bash
#
# crunchy-triage.local.sh — run the crunchy-triage workflow on a developer's machine: the shell
# equivalent of tools/n8n/workflows/crunchy-triage.json. Same stages, read-only + idempotent.
#
#   Webhook params       -> NAMESPACE (env)
#   Collect              -> run each read-only snippet-*, merge their JSON
#   Validate             -> run each validator-* on the merged JSON, key verdicts by .check
#   Report (chained)     -> render the PG report, then the main report with it as .previous
#   Markdown -> HTML     -> view.sh (HTML in /tmp, prints a file:// URL)
#
#   NAMESPACE=f208ae-dev tools/n8n/workflows/crunchy-triage.local.sh    # prints a file:// URL to open
set -euo pipefail

# Resolve the repo root from this script's location (it lives in tools/n8n/workflows/).
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
N8N="$ROOT/tools/n8n"
SNIPPETS="$N8N/snippets/crunchy-triage"
REPORT="$SNIPPETS/snippet-triage-report.md"
PG_REPORT="$SNIPPETS/snippet-pg-report.md"
NAME="crunchy-triage"

# --- Inputs (the webhook params) -------------------------------------------------------
: "${NAMESPACE:?set NAMESPACE (the triage target, e.g. f208ae-dev)}"

# --- Collect: one read-only snippet per step; each prints a JSON object. `|| true` keeps a
#     failing step from aborting the run — its data is just absent, and the conditional report
#     renders whatever did arrive.
collect=(
  snippet-cluster-status snippet-pgbackrest-info
  snippet-pg-connections snippet-pg-activity snippet-pg-wal snippet-pg-cache
)
parts=()
for s in "${collect[@]}"; do
  parts+=("$(NAMESPACE="$NAMESPACE" bash "$SNIPPETS/$s.sh" 2>/dev/null || true)")
done
merged="$(printf '%s\n' "${parts[@]}" | jq -s 'add // {}')"

# --- Validate: each validator reads the merged JSON and emits { check, status, message }.
#     Key the verdicts by .check into .validations (graceful: drop any empty/invalid output).
validators=(
  validator-cluster-status validator-pgbackrest
  validator-pg-connections validator-pg-cache validator-pg-wal
)
verdicts=()
for v in "${validators[@]}"; do
  verdicts+=("$(printf '%s' "$merged" | bash "$SNIPPETS/$v.sh" 2>/dev/null || true)")
done
validations="$(printf '%s\n' "${verdicts[@]}" | jq -s 'map(select(type == "object" and has("check"))) | map({(.check): .}) | add // {}')"
final="$(printf '%s' "$merged" | jq --argjson v "$validations" '. + {validations: $v}')"

# --- Report (chained): render the PG report, then render the main report with it as .previous,
#     and open the result. The page shows the triage report with the PG report appended below.
pg_md="$(printf '%s' "$final" | NAMESPACE="$NAMESPACE" bash "$N8N/render.sh" "$PG_REPORT")"
printf '%s' "$final" | jq --arg prev "$pg_md" '. + {previous: $prev}' \
  | NAMESPACE="$NAMESPACE" bash "$N8N/render.sh" "$REPORT" \
  | bash "$N8N/view.sh" "$NAME"
