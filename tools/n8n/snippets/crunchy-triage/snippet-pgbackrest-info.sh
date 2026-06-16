#!/usr/bin/env bash
# snippet-pgbackrest-info — read-only pgBackRest backup/repo state as JSON.
#
# Cleaned from crunchy-dr-wiki "Get State Info" (the read-only collection part only).
# Params: NAMESPACE (env or $1, required).
# Read-only + idempotent: only `pgbackrest info` — safe to re-run any time.
# Output (stdout JSON): { namespace, repo_pod, pgbackrest[] }.
set -euo pipefail

NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"

repo="$(oc get pods -n "$NS" -l postgres-operator.crunchydata.com/data=pgbackrest \
  -o name 2>/dev/null | head -n1)"
if [ -z "$repo" ]; then
  jq -n --arg ns "$NS" '{namespace: $ns, error: "no pgbackrest repo pod found"}'
  exit 1
fi

info="$(oc exec -n "$NS" "$repo" -- pgbackrest info --output=json 2>/dev/null || echo '[]')"

jq -n \
  --arg ns "$NS" \
  --arg repo "${repo#pod/}" \
  --argjson info "$info" \
  '{namespace: $ns, repo_pod: $repo, pgbackrest: $info}'
