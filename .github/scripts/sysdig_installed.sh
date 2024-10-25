#!/bin/bash
# Fetches the sysdig team crd and checks at least 1 user is present in the config
# ENV:
# OC_NAMESPACE
# OC_SERVER
# OC_TOKEN
set -e # failfast
if [ -z "$NAMESPACE" ]; then
    echo "NAMESPACE not set"
    exit 1
fi
if [ -z "$OC_SERVER" ]; then
    echo "OC_SERVER not set"
    exit 1
fi
if [ -z "$OC_TOKEN" ]; then
    echo "OC_TOKEN not set"
    exit 1
fi

OC_TEMP_TOKEN=$(curl -k -X POST $OC_SERVER/api/v1/namespaces/$OC_NAMESPACE/serviceaccounts/pipeline/token --header "Authorization: Bearer $OC_TOKEN" -d '{"spec": {"expirationSeconds": 600}}' -H 'Content-Type: application/json; charset=utf-8' | jq -r '.status.token' )
oc login --token=$OC_TEMP_TOKEN --server=$OC_SERVER
oc project $OC_NAMESPACE # Safeguard!


sysdig_config=$(oc -n $NAMESPACE get sysdig-team -ojson)
num_users=$(echo $sysdig_config | jq -r '.items[0].spec.team.users | length')
if [ $num_users -eq 0 ]; then
    echo "No users found in sysdig-team"
    exit 1
fi
echo "Found $num_users users in sysdig-team"
exit 0
