#!/bin/bash
# Cleanup Scan
#
# Performs a scan of workloads older than 30s, checks for dangling secrets, pvcs, and configmaps
# This script only lists findings and returns a 0/1 (pass/fail) and does not perform a delete.
# For CI/CD safety, only the counts are output, and users are encouraged to run this locally 
# in order to see the names and perform the delete themselves.
#
# Dependencies: curl, oc, jq
# Note: the windows variant of jq has differing newline behaviour
#
set -e # failfast
trap 'echo "Error occurred at line $LINENO while executing function $FUNCNAME"' ERR


# ENV:
# OC_NAMESPACE: namespace to scan
# SKIP_AUTH: set to true to skip auth and use your existing local kubeconfig
# OC_SERVER: OpenShift server URL
# OC_TOKEN: OpenShift token
# ALLOW_EXPR: expression passed into grep extended search to allow certain resources to be skipped

# THIRTY_DAYS_IN_SECONDS=2592000 - variables in the jq dont play nice so we will just hardcode it

help_str() {
    echo "Usage: SKIP_AUTH=true OC_NAMESPACE=<namespace> ./cleanup_scan.sh"
    echo ""
    echo "Ensure you have curl, oc, and jq installed and available on your path, and have performed a oc login."
    echo ""
    echo "The ALLOW_EXPR regex is passed to grep -E for resource filtering. To read more run: man grep"
    echo ""
    echo "After running the script, if any results are found you can cat any of the following files:"
    echo "cat /tmp/old_workloads_to_delete.txt;"
    echo "cat /tmp/secrets_to_delete.txt;"
    echo "cat /tmp/pvcs_to_delete.txt;"
    echo "cat /tmp/configmaps_to_delete.txt;"
    echo ""
    echo "Note that these respective files only exist if results are found."
}

# Configure globals
if [ -z "$ALLOW_EXPR" ]; then
    ALLOW_EXPR="default|pipeline|artifact|vault|deployer|logging|builder|keycloak|openshift|bundle|kube|object-store"
fi
echo "ALLOW_EXPR: $ALLOW_EXPR"

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
OK=0

# checks if the resource name appears in the allow expression
# and removes it if found, preventing a false positive
filter_items() {
    local items="$1"
    local filtered_items=()
    # convert items to an array for easy manipulation
    local iter_array_items=()
    mapfile -t array_items < <(echo "$items")
    for item in "${array_items[@]}"; do
        if ! echo "$item" | grep -Eq "$ALLOW_EXPR"; then
            iter_array_items+=("$item")
        fi
    done
    # organize the filtered items
    for item in "${iter_array_items[@]}"; do
        if [[ -n "$item" ]]; then
            filtered_items+=("$item")
        fi
    done
    duplicates_result=$(printf "%s\n" "${filtered_items[@]}")
    unique_result=$(echo "$duplicates_result" | sort | uniq)
    echo "$unique_result"
}

# standard function to output found deletions to a file, and set the OK flag
# note that the message can contain NUM_ITEMS which will be replaced with the count found
found_deletions() {
    local file_name=$1
    local err_message=$2
    local ok_message=$3
    local items=$4
    local num_items
    num_items=$(echo "$items" | grep -cve '^\s*$' || echo 0)
    num_items=${num_items//[^0-9]/} # ensure num_items is an integer
    if [ "$num_items" -gt 0 ]; then
        echo -e "$items" > "/tmp/$file_name"
        echo "${err_message//NUM_ITEMS/$num_items}"
        OK=1
    else
        echo "$ok_message"
    fi
}

# First, get workloads older than 30 days
echo "Scanning for workloads older than 30 days in the targeted namespace"
echo "..."
old_workloads=$(oc get deploy,service,statefulset -n $OC_NAMESPACE -ojson | jq -r '.items[] | select(.metadata.creationTimestamp | fromdateiso8601 | (. + 2592000) < now) | "\(.kind)/\(.metadata.name)"')
old_workloads=$(filter_items "$old_workloads")
old_workloads_to_delete=$old_workloads
found_deletions \
    "old_workloads_to_delete.txt" \
    "Found NUM_ITEMS workloads older than 30 days in the targeted namespace" \
    "Found no stale workloads in the targeted namespace" \
    "$old_workloads_to_delete"
echo ""
echo ""

# next get all secrets not used by a pod older than 30 days
# Get all secret names used by pods and write to a file
echo "Scanning for dangling secrets not used by workloads"
echo "..."
oc get pods -n $OC_NAMESPACE -ojson | jq -r '.items[] | "\(.metadata.name):\(.spec.containers[].envFrom[]?.secretRef.name)"' | grep -v null > /tmp/in_use_secrets.txt
oc get pods -n $OC_NAMESPACE -ojson | jq -r '.items[] | "\(.metadata.name):\(.spec.containers[].env[].valueFrom?.secretKeyRef?.name)"' | grep -v null >> /tmp/in_use_secrets.txt
secret_names=$(oc get secret -n $OC_NAMESPACE -ojson | jq -r '.items[] | select(.metadata.creationTimestamp | fromdateiso8601 | (. + 2592000) < now) | .metadata.name')
secrets_to_delete=()
for secret in $secret_names; do
    if ! grep -q $secret /tmp/in_use_secrets.txt; then
        secrets_to_delete+=("secret/$secret\n")
    fi
done
secrets_list=$(echo -e "${secrets_to_delete[@]}")
filtered_secrets=$(filter_items "$secrets_list")
found_deletions \
    "secrets_to_delete.txt" \
    "Found NUM_ITEMS dangling secrets older than 30 days in the targeted namespace" \
    "Found no stale and dangling secrets in the targeted namespace" \
    "${filtered_secrets}"
echo ""
echo ""

# next get all pvcs not used by a pod
# Get all pvc names used by pods and write to a file
echo "Scanning for dangling pvcs not used by workloads"
echo "..."
oc get pods -n $OC_NAMESPACE -ojson | jq -r '.items[] | "\(.metadata.name):\(.spec.volumes[]?.persistentVolumeClaim.claimName)"' > /tmp/in_use_pvc.txt
in_use_pvcs=$(cat /tmp/in_use_pvc.txt | grep -v "null" | sort | uniq)
echo -e "$in_use_pvcs" > /tmp/in_use_pvc.txt
pvc_list=$(oc get pvc -n $OC_NAMESPACE -ojson | jq -r '.items[] | select(.metadata.creationTimestamp | fromdateiso8601 | (. + 2592000) < now) | .metadata.name')
pvcs_to_delete=()
for pvc in $pvc_list; do
    if ! grep -q $pvc /tmp/in_use_pvc.txt; then
        pvcs_to_delete+=("pvc/$pvc\n")
    fi
done
pvc_list=$(echo -e "${pvcs_to_delete[@]}")
filtered_pvcs=$(filter_items "$pvc_list")
found_deletions \
    "pvcs_to_delete.txt" \
    "Found NUM_ITEMS dangling PVCs older than 30 days in the targeted namespace" \
    "Found no stale and dangling PVCs in the targeted namespace" \
    "${filtered_pvcs}"
echo ""
echo ""

# next get all configmaps not used by a pod
echo "Scanning for dangling configmaps not used by workloads"
echo "..."
oc get pods -n $OC_NAMESPACE -ojson | jq -r '.items[] | "\(.metadata.name):\(.spec.volumes[]?.configMap.name)"' > /tmp/in_use_configmaps.txt
configmap_names=$(oc get configmap -n $OC_NAMESPACE -ojson | jq -r '.items[] | select(.metadata.creationTimestamp | fromdateiso8601 | (. + 2592000) < now) | .metadata.name')
configmaps_to_delete=()
for configmap in $configmap_names; do
    if ! grep -q $configmap /tmp/in_use_configmaps.txt; then
        configmaps_to_delete+=("configmap/$configmap\n")
    fi
done
configmap_list=$(echo -e "${configmaps_to_delete[@]}")
filtered_configmaps=$(filter_items "$configmap_list")
found_deletions \
    "configmaps_to_delete.txt" \
    "Found NUM_ITEMS dangling configmaps older than 30 days in the targeted namespace" \
    "Found no stale and dangling configmaps in the targeted namespace" \
    "${filtered_configmaps}"
echo ""
echo ""

if [ $OK -eq 1 ]; then
    echo "To delete these found workloads, locally run the following to see them:"
    echo "Note: skip flag uses your existing oc authentication"
    echo ""
    echo "ALLOW_EXPR=\"$ALLOW_EXPR\" SKIP_AUTH=true ./.github/scripts/cleanup_scan.sh;"
    echo "cat /tmp/old_workloads_to_delete.txt; cat /tmp/secrets_to_delete.txt; cat /tmp/pvcs_to_delete.txt; cat /tmp/configmaps_to_delete.txt"

fi

exit $OK
