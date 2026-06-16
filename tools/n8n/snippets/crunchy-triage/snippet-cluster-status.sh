#!/usr/bin/env bash
# snippet-cluster-status — read-only crunchy/patroni cluster state as JSON.
#
# Cleaned from crunchy-dr-wiki "Get State Info" (the read-only collection part only).
# Params: NAMESPACE (env or $1, required).
# Read-only + idempotent: only `patronictl list` / `show-config` — safe to re-run any time.
# Output (stdout JSON): { namespace, primary_pod, members[], config }.
set -euo pipefail

NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"

primary="$(oc get pods -n "$NS" -l postgres-operator.crunchydata.com/role=master \
  -o name 2>/dev/null | head -n1)"
if [ -z "$primary" ]; then
  jq -n --arg ns "$NS" '{namespace: $ns, error: "no primary (master) pod found"}'
  exit 1
fi

members="$(oc exec -n "$NS" "$primary" -- patronictl list -f json 2>/dev/null || echo '[]')"
config="$(oc exec -n "$NS" "$primary" -- patronictl show-config 2>/dev/null || echo '')"

jq -n \
  --arg ns "$NS" \
  --arg primary "${primary#pod/}" \
  --argjson members "$members" \
  --arg config "$config" \
  '{namespace: $ns, primary_pod: $primary, members: $members, config: $config}'
