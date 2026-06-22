#!/usr/bin/env bash
#
# crunchy-triage.local.sh — run the crunchy-triage workflow on a developer's machine: the shell
# equivalent of tools/n8n/workflows/crunchy-triage.json. Same stages, read-only + idempotent.
#
#   Webhook params   -> NAMESPACE (env)
#   Collect          -> run each read-only snippet-*; MERGE_* -> merge.sh      (flat -> merged JSON)
#   Validate         -> run each validator-* on merged;  MERGE_* -> merge.sh -k (keyed -> validations)
#   Report (chained) -> report.sh: assemble merged + { validations }, render the reports chained
#   Markdown -> HTML -> view.sh (HTML in /tmp, prints a file:// URL)
#
# Every cross-node merge goes through tools/n8n/merge.sh, exactly as the n8n workflow does — no
# bespoke jq plumbing here — so local and n8n stay in lockstep. Each MERGE_<KEY>=<output> line is
# one n8n node's stdout; merge.sh combines them. flat = collection (fields stay top-level); keyed
# = validations (each verdict under its check name).
#
#   NAMESPACE=f208ae-dev tools/n8n/workflows/crunchy-triage.local.sh    # prints a file:// URL to open
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
N8N="$ROOT/tools/n8n"
SNIPPETS="$N8N/snippets/crunchy-triage"
NAME="crunchy-triage"

: "${NAMESPACE:?set NAMESPACE (the triage target, e.g. f208ae-dev)}"

# This cluster is Crunchy: the general pg-* snippets take a pod SELECTOR (they assume no operator) —
# point them at the Patroni primary. The crunchy-specific snippets ignore it.
export SELECTOR="postgres-operator.crunchydata.com/role=master"

# The lib scripts (merge.sh/report.sh/render.sh/view.sh/utils.sh) are owned by the workflow-builder
# skill; sync the copies deployed here from the (installed) skill so a stale or missing one can't
# silently change the result. Set WORKFLOW_BUILDER_SKILL to the installed skill (default: co-located).
SKILL="${WORKFLOW_BUILDER_SKILL:-$N8N/skills/workflow-builder}"
if [[ -x "$SKILL/scripts/sync.sh" ]]; then
  bash "$SKILL/scripts/sync.sh" "$N8N"
else
  echo "warning: workflow-builder skill not found at $SKILL — using the deployed lib scripts as-is" >&2
fi

# Run snippet/validator $1 (validators take the merged JSON on stdin) and echo its output; `|| true`
# keeps a failing step from aborting the run — its data is just absent.
snip() {
  echo "  - $1" >&2
  NAMESPACE="$NAMESPACE" bash "$SNIPPETS/$1.sh" 2>/dev/null || true
}

# --- Collect: each snippet prints a JSON object; hand them to merge.sh as MERGE_* and flat-merge,
#     so .members / .connections / .wal / … stay top-level. The MERGE_ names are just unique labels.
echo "collecting from namespace '$NAMESPACE'..." >&2
export MERGE_CLUSTER="$(snip snippet-cluster-status)"
export MERGE_PGBACKREST="$(snip snippet-pgbackrest-info)"
export MERGE_CONNECTIONS="$(snip snippet-pg-connections)"
export MERGE_ACTIVITY="$(snip snippet-pg-activity)"
export MERGE_WAL="$(snip snippet-pg-wal)"
export MERGE_CACHE="$(snip snippet-pg-cache)"
merged="$(bash "$N8N/merge.sh")"
unset ${!MERGE_@}

# --- Validate: each validator reads the merged JSON and emits { check, status, ... }. Pass them as
#     MERGE_<CHECK> to merge.sh -k, which keys each under its check name -> the .validations object.
echo "validating..." >&2
export MERGE_CLUSTER="$(printf '%s' "$merged" | snip validator-cluster-status)"
export MERGE_PGBACKREST="$(printf '%s' "$merged" | snip validator-pgbackrest)"
export MERGE_CONNECTIONS="$(printf '%s' "$merged" | snip validator-pg-connections)"
export MERGE_WAL="$(printf '%s' "$merged" | snip validator-pg-wal)"
export MERGE_CACHE="$(printf '%s' "$merged" | snip validator-pg-cache)"
validations="$(bash "$N8N/merge.sh" -k)"
unset ${!MERGE_@}

# --- Report (chained): report.sh assembles the final payload (merged + { validations }) and
#     renders the reports, chaining each as the next's .previous (first arg = top of the page).
#     DATA/VALS go in base64, exactly as the n8n report node passes them (shell-safe transport).
echo "rendering report..." >&2
export DATA="$(printf '%s' "$merged" | base64 | tr -d '\n')"
export VALS="$(printf '%s' "$validations" | base64 | tr -d '\n')"
NAMESPACE="$NAMESPACE" bash "$N8N/report.sh" crunchy-triage snippet-triage-report.md snippet-pg-report.md \
  | bash "$N8N/view.sh" "$NAME"
