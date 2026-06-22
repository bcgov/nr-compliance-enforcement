#!/usr/bin/env bash
#
# app-triage.local.sh — run the app-triage workflow on a developer's machine: the shell
# equivalent of tools/n8n/workflows/app-triage.json. Same stages, read-only + idempotent.
#
#   Webhook params   -> NAMESPACE (env)
#   Collect          -> run logs + errors snippets per service; MERGE_* -> merge.sh   (flat)
#   Validate         -> run each validator-* on merged;         MERGE_* -> merge.sh -k (keyed)
#   Report           -> report.sh: assemble merged + { validations }, render the report
#   Markdown -> HTML -> view.sh (HTML in /tmp, prints a file:// URL)
#
# Every cross-node merge goes through tools/n8n/merge.sh, exactly as the n8n workflow does — no
# bespoke jq plumbing — so local and n8n stay in lockstep. Each MERGE_<KEY>=<output> is one node's
# stdout; flat = collection (each service's output is its own top-level key), keyed = validations.
#
#   NAMESPACE=f208ae-dev tools/n8n/workflows/app-triage.local.sh    # prints a file:// URL to open
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
N8N="$ROOT/tools/n8n"
GROUP="app-triage"
SNIPPETS="$N8N/snippets/$GROUP"
NAME="app-triage"

: "${NAMESPACE:?set NAMESPACE (the triage target, e.g. f208ae-dev)}"

# The lib scripts (merge.sh/report.sh/view.sh/render.sh/utils.sh) are owned by the workflow-builder
# skill and must already be deployed beside this tree. This script does NOT self-sync — the agent
# refreshes them with scripts/sync.sh --config <config.yaml> before a run. Fail fast if one is gone.
for lib in merge.sh report.sh view.sh; do
  [ -x "$N8N/$lib" ] || { echo "error: $N8N/$lib missing — run: workflow-builder/scripts/sync.sh --config $N8N/config.yaml" >&2; exit 1; }
done

# Collect snippet $1 for service $2 (passed as SHORTNAME); echo its JSON. `|| true` so a failing
# step is simply absent — its data drops out and the conditional report renders whatever arrived.
collect() {
  echo "  - $1 ($2)" >&2
  NAMESPACE="$NAMESPACE" SHORTNAME="$2" bash "$SNIPPETS/$1.sh" 2>/dev/null || true
}
# Run validator $1 over the merged JSON it receives on stdin; echo its verdict.
validate() {
  echo "  - $1" >&2
  bash "$SNIPPETS/$1.sh" 2>/dev/null || true
}

# --- Collect: logs + errors per service -> flat-merge (backend_logs / backend_errors / … stay
#     top-level). The MERGE_ names here are just unique labels.
echo "collecting from namespace '$NAMESPACE'..." >&2
export MERGE_BACKEND_LOGS="$(collect snippet-app-logs backend)"
export MERGE_BACKEND_ERRORS="$(collect snippet-app-errors backend)"
export MERGE_BACKENDCM_LOGS="$(collect snippet-app-logs backendcm)"
export MERGE_BACKENDCM_ERRORS="$(collect snippet-app-errors backendcm)"
export MERGE_FRONTEND_LOGS="$(collect snippet-app-logs frontend)"
export MERGE_FRONTEND_ERRORS="$(collect snippet-app-errors frontend)"
merged="$(bash "$N8N/merge.sh")"
unset ${!MERGE_@}

# --- Validate: each validator reads the merged JSON and emits { check, status, ... }. Pass as
#     MERGE_<CHECK> to merge.sh -k, which keys each under its check name -> the .validations object.
echo "validating..." >&2
export MERGE_AVAILABILITY="$(printf '%s' "$merged" | validate validator-app-availability)"
export MERGE_ERRORS="$(printf '%s' "$merged" | validate validator-app-errors)"
validations="$(bash "$N8N/merge.sh" -k)"
unset ${!MERGE_@}

# --- Report: report.sh assembles merged + { validations } and renders the report. DATA/VALS go in
#     base64, exactly as the n8n report node passes them (shell-safe transport).
echo "rendering report..." >&2
export DATA="$(printf '%s' "$merged" | base64 | tr -d '\n')"
export VALS="$(printf '%s' "$validations" | base64 | tr -d '\n')"
NAMESPACE="$NAMESPACE" bash "$N8N/report.sh" "$GROUP" snippet-app-report.md \
  | bash "$N8N/view.sh" "$NAME"
