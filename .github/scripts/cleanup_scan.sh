#!/bin/bash
# Cleanup Scan
#
# Performs a scan of workloads older than 30s, checks for dangling secrets, pvcs, and configmaps
# This script only lists findings and returns a 0/1 (pass/fail) and does not perform a delete.
# For CI/CD safety, only the counts are output, and users are encouraged to run this locally 
# in order to see the names and perform the delete themselves.
#
set -e # failfast

# ENV:
# OC_NAMESPACE: namespace to scan
# SKIP_AUTH: set to true to skip auth and use your existing local kubeconfig
# OC_SERVER: OpenShift server URL
# OC_TOKEN: OpenShift token
# ALLOW_LIST: comma separated list of workloads to ignore
if [ -z "$ALLOW_LIST" ]; then
    ALLOW_LIST=""
fi
ALLOW_LIST=$(echo "$ALLOW_LIST" | tr "," "\n")
echo "ALLOW_LIST: $ALLOW_LIST"
OC_TEMP_TOKEN=""
if [ -z "$OC_NAMESPACE" ]; then
    echo "OC_NAMESPACE is not set. Exiting..."
    exit 1
fi
if [ "$SKIP_AUTH" != "true" ]; then
    if [ -z "$OC_SERVER" ]; then
        echo "OC_SERVER is not set. Exiting..."
        exit 1
    fi
    if [ -z "$OC_TOKEN" ]; then
        echo "OC_TOKEN is not set. Exiting..."
        exit 1
    fi
    # Auth flow
    OC_TEMP_TOKEN=$(curl -k -X POST $OC_SERVER/api/v1/namespaces/$OC_NAMESPACE/serviceaccounts/pipeline/token --header "Authorization: Bearer $OC_TOKEN" -d '{"spec": {"expirationSeconds": 600}}' -H 'Content-Type: application/json; charset=utf-8' | jq -r '.status.token' )
    oc login --token=$OC_TEMP_TOKEN --server=$OC_SERVER
    oc project $OC_NAMESPACE # Safeguard!
fi


ok=0
touch /tmp/old_workloads.txt
touch /tmp/secrets_to_delete.txt
touch /tmp/pvcs_to_delete.txt
touch /tmp/configmaps_to_delete.txt

# First, get workloads older than 30 days
echo "Scanning for workloads older than 30 days in the targeted namespace"
echo "..."
# THIRTY_DAYS_IN_SECONDS=2592000
old_workloads=$(oc get deploy,service,statefulset -n $OC_NAMESPACE -ojson | jq -r '.items[] | select(.metadata.creationTimestamp | fromdateiso8601 | (. + 2592000) < now) | "\(.kind)/\(.metadata.name)"')
filtered_workloads=()
for workload in $old_workloads; do
    if ! echo "$ALLOW_LIST" | grep -q "^$workload$"; then
        filtered_workloads+=("$workload")
    fi
done
old_workloads="${filtered_workloads[*]}"
num_old_workloads=$(echo $old_workloads | wc -w)
if [ $num_old_workloads -gt 0 ]; then
    echo -e "$old_workloads" > /tmp/old_workloads.txt
    echo -e "\n" >> /tmp/old_workloads.txt
    echo "Found $num_old_workloads workloads older than 30 days in the targeted namespace"
    ok=1
else
    echo "Found no stale workloads in the targeted namespace"
fi
echo ""
echo ""

# next get all secrets not used by a pod older than 30 days
# Get all secret names used by pods and write to a file
echo "Scanning for dangling secrets not used by workloads"
echo "..."
oc get pods -n $OC_NAMESPACE -ojson | jq -r '.items[] | "\(.metadata.name):\(.spec.containers[].envFrom[]?.secretRef.name)"' > /tmp/in_use_secrets.txt
secret_names=$(oc get secret -n $OC_NAMESPACE -ojson | jq -r '.items[] | select(.metadata.creationTimestamp | fromdateiso8601 | (. + 2592000) < now) | .metadata.name')
secrets_to_delete=()
for secret in $secret_names; do
    if ! grep -q $secret /tmp/in_use_secrets.txt; then
        secrets_to_delete+=("secret/$secret\n")
    fi
done
filtered_secrets=()
for secret in "${secrets_to_delete[@]}"; do
    if ! echo "$ALLOW_LIST" | grep -q "$secret\n"; then
        filtered_secrets+=("$secret")
    fi
done
secrets_to_delete=("${filtered_secrets[@]}")
num_secrets_to_delete=${#secrets_to_delete[@]}
if [ $num_secrets_to_delete -gt 0 ]; then
    echo "Found $num_secrets_to_delete secrets older than 30 days not used by any pod in the targeted namespace"
    echo -e "${secrets_to_delete[@]}" > /tmp/secrets_to_delete.txt
    ok=1
else
    echo "Found no stale and dangling secrets in the targeted namespace"
fi
echo ""
echo ""

# next get all pvcs not used by a pod
# Get all pvc names used by pods and write to a file
echo "Scanning for dangling pvcs not used by workloads"
echo "..."
oc get pods -n $OC_NAMESPACE -ojson | jq -r '.items[] | "\(.metadata.name):\(.spec.volumes[]?.persistentVolumeClaim.claimName)"' > /tmp/in_use_pvc.txt
in_use_pvcs=$(cat /tmp/in_use_pvc.txt | grep -v "null" | sort | uniq)
echo -e "$in_use_pvcs" > /tmp/in_use_pvc.txt
pvcs_to_delete=()
for pvc in $(oc get pvc -n $OC_NAMESPACE -ojson | jq -r '.items[] | select(.metadata.creationTimestamp | fromdateiso8601 | (. + 2592000) < now) | .metadata.name'); do
    if ! grep -q $pvc /tmp/in_use_pvc.txt; then
        pvcs_to_delete+=("pvc/$pvc\n")
    fi
done
filtered_pvcs=()
for pvc in "${pvcs_to_delete[@]}"; do
    if ! echo "$ALLOW_LIST" | grep -q "^$pvc\n$"; then
        filtered_pvcs+=("$pvc")
    fi
done
pvcs_to_delete=("${filtered_pvcs[@]}")
num_pvcs_to_delete=${#pvcs_to_delete[@]}
if [ $num_pvcs_to_delete -gt 0 ]; then
    echo "Found $num_pvcs_to_delete pvcs older than 30 days not used by any pod in the targeted namespace"
    echo -e "${pvcs_to_delete[@]}" > /tmp/pvcs_to_delete.txt
    ok=1
else
    echo "Found no stale and dangling pvcs in the targeted namespace"
fi
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
filtered_configmaps=()
for configmap in "${configmaps_to_delete[@]}"; do
    if ! echo "$ALLOW_LIST" | grep -q "^$configmap\n$"; then
        filtered_configmaps+=("$configmap")
    fi
done
configmaps_to_delete=("${filtered_configmaps[@]}")
num_configmaps_to_delete=${#configmaps_to_delete[@]}
if [ $num_configmaps_to_delete -gt 0 ]; then
    echo "Found $num_configmaps_to_delete configmaps older than 30 days not used by any pod in the targeted namespace"
    echo -e "${configmaps_to_delete[@]}" > /tmp/configmaps_to_delete.txt
    ok=1
else
    echo "Found no stale and dangling configmaps in the targeted namespace"
fi
echo ""
echo ""

if [ $ok -eq 1 ]; then
    echo "To delete these found workloads, locally run the following to see them:"
    echo "Note: skip flag uses your existing oc authentication"
    echo ""
    echo "SKIP_AUTH=true ./.github/scripts/cleanup_scan.sh"
    echo "cat /tmp/old_workloads.txt && cat /tmp/secrets_to_delete.txt && cat /tmp/pvcs_to_delete.txt && cat /tmp/configmaps_to_delete.txt"

fi

exit $ok