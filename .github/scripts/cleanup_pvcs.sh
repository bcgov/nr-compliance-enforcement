#!/bin/bash
# Cleanup NATS JetStream PVC (deletion) and other team specific PVCs
# Why: nats js pvc does not have label passthrough https://github.com/nats-io/k8s/blob/nats-1.2.6/helm/charts/nats/files/stateful-set/jetstream-pvc.yaml
# So we manually find it and delete it on non-draft PR close and ONLY in *dev namespaces
#
# Dependencies: curl, oc
#
set -e # failfast
trap 'echo "Error occurred at line $LINENO while executing function $FUNCNAME"' ERR

# ENV:
# OC_NAMESPACE: namespace to scan
# SKIP_AUTH: set to true to skip auth and use your existing local kubeconfig
# OC_SERVER: OpenShift server URL
# OC_TOKEN: OpenShift token
# PR_NUMBER: PR number

help_str() {
    echo "Usage: SKIP_AUTH=true OC_NAMESPACE=<namespace> PR_NUMBER=<number> ./cleanup_nats_js.sh"
    echo ""
    echo "Ensure you have curl, oc installed and available on your path, and have performed a oc login if skipping auth for a local run."
    echo ""
    echo "Note: this script will skip cleanup if the namespace is not a development environment."
}

# Handle auth
OC_TEMP_TOKEN=""
if [ -z "$OC_NAMESPACE" ]; then
    echo "OC_NAMESPACE is not set. Exiting..."
    help_str
    exit 1
fi
if [ "$SKIP_AUTH" != "true" ]; then
    if [ -z "$OC_SERVER" ]; then
        echo "OC_SERVER is not set. Exiting..."
        help_str
        exit 1
    fi
    if [ -z "$OC_TOKEN" ]; then
        echo "OC_TOKEN is not set. Exiting..."
        help_str
        exit 1
    fi
    # Auth flow
    OC_TEMP_TOKEN=$(curl -k -X POST $OC_SERVER/api/v1/namespaces/$OC_NAMESPACE/serviceaccounts/pipeline/token --header "Authorization: Bearer $OC_TOKEN" -d '{"spec": {"expirationSeconds": 600}}' -H 'Content-Type: application/json; charset=utf-8' | jq -r '.status.token' )
    oc login --token=$OC_TEMP_TOKEN --server=$OC_SERVER
    oc project $OC_NAMESPACE # Safeguard!
fi

# test / prod safeguard
if [[ "$OC_NAMESPACE" != *"dev"* ]]; then
    echo "Namespace is not configured to a development environment, skipping cleanup"
    exit 0
fi

get_njs_pvc_name() {
    local pvc_name
    pvc_name=$(oc get pvc -n $OC_NAMESPACE -oname | grep "nats-js" | grep "$PR_NUMBER")
    echo "$pvc_name"
}

get_metabase_pvc_name() {
    local pvc_name
    pvc_name=$(oc get pvc -n $OC_NAMESPACE -oname | grep "metabase" | grep "$PR_NUMBER")
    echo "$pvc_name"
}

delete_pvc() {
    local pvc_name=$1
    echo "Found pvc '$pvc_name' using PR Number $PR_NUMBER in namespace $OC_NAMESPACE"
    if [ -z "$pvc_name" ]; then
        echo "Error: no pvc found to delete"
        echo "This failure could be expected if the helm build for the PR did not complete, a draft PR was closed, or the PR was quickly opened and closed."
        exit 1
    fi
    echo "Performing deletion of pvc $pvc_name..."
    echo "..."
    oc delete $pvc_name -n $OC_NAMESPACE
}

main() {
    delete_pvc "$(get_njs_pvc_name)"
    delete_pvc "$(get_metabase_pvc_name)"
    echo "Completed"
}
main