#!/bin/bash
# Designed for use together with tools like Helm to provide a secondary health check on a release
# in addition to default helm health checks. Ideally, you should set the timeout to be slightly less
# than the default helm install/upgrade timeout to allow for this script to run and collect information from
# ephemeral workloads before helm cleans them up in the event of an atomic failure.
#
# Note that this script does not surface log details, but does provide commands to fetch them if found
#
# Dependencies: oc, jq

# ENV:
# OC_NAMESPACE: namespace to scan
# SKIP_AUTH: set to true to skip auth and use your existing local kubeconfig
# OC_SERVER: OpenShift server URL
# TIMEOUT_SECONDS: timeout in seconds for health check
# POLL_INTERVAL_SECONDS: interval in seconds to poll health check
# LABEL_SELECTOR: label selector to filter resources to health check on
# ERROR_EXPR: error expression to search for in logs

# TODO: break out funcs into plugins

# configure defaults
if [ -z "$ERROR_EXPR" ]; then
    ERROR_EXPR="error|fatal|exception|stacktrace"
fi
if [ -z "$TIMEOUT_SECONDS" ]; then
    TIMEOUT_SECONDS=420 # 7m
fi
if [ -z "$POLL_INTERVAL_SECONDS" ]; then
    POLL_INTERVAL_SECONDS=15
fi

# will be set to 1 if a timeout occurs from an unfinished rollout
# we use this to fetch triage info
TIMED_OUT=0

# string of commands to run after health check for additional info
COMMANDS_TO_RUN=""

# global flag to indicate if health check passed
HEALTH_CHECK_PASSED=0


set -e # failfast
trap 'echo "Error occurred at line $LINENO while executing function $FUNCNAME"' ERR

help_str() {
    echo "Usage: SKIP_AUTH=true LABEL_SELECTOR=\"app.kubernetes.io/instance=nr-compliance-enforcement-YOURPR\" OC_NAMESPACE=c1c7ed-dev .github/scripts/rollout_healthcheck.sh"
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

get_workload_list() {
    local label_selector=$1
    local workload_list
    workload_list=$(oc get all -n $OC_NAMESPACE -l $label_selector -oname)
    echo "$workload_list"
}

echo_red() {
    echo -e "\033[0;31m$1\033[0m"
}

echo_green() {
    echo -e "\033[0;32m$1\033[0m"
}

echo_yellow() {
    echo -e "\033[0;33m$1\033[0m"
}

echo_checkmark() {
    echo  "✅"
}

echo_cross() {
    echo "❌"
}

# checks if the deployment has replicas in the correct states
_health_check_deployment() {
    local healthy="false"
    local no_unready_replicas="false"
    local equal_ready_replicas="false"
    local one_available_replica="false"
    local workload_name=$1
    local replicas
    local unavailable_replicas
    local ready_replicas
    replicas=$(oc get -n $OC_NAMESPACE $workload_name -o jsonpath='{.status.replicas}')
    # 2 following keys can not exist in the manifest if they're 0
    unavailable_replicas=$(oc get -n $OC_NAMESPACE $workload_name -o jsonpath='{.status.unavailableReplicas}')
    one_available_replica=$(oc get -n $OC_NAMESPACE $workload_name -o jsonpath='{.status.availableReplicas}')
    if [ -z "$unavailable_replicas" ]; then
        unavailable_replicas=0
    fi
    ready_replicas=$(oc get -n $OC_NAMESPACE $workload_name -o jsonpath='{.status.readyReplicas}')
    if [ -z "$ready_replicas" ]; then
        ready_replicas=0
    fi
    if [ -z "$one_available_replica" ]; then
        one_available_replica=0
    fi
    # begin replica flag setting
    if [ "$replicas" -eq "$ready_replicas" ]; then
        equal_ready_replicas="true"
    fi
    if [ "$unavailable_replicas" -eq 0 ]; then
        no_unready_replicas="true"
    fi
    if [ "$one_available_replica" -eq 1 ]; then
        one_available_replica="true"
    fi
    if [ "$equal_ready_replicas" == "true" ] && [ "$no_unready_replicas" == "true" ] && [ "$one_available_replica" == "true" ]; then
        healthy="true"
    fi
    echo "$healthy"
}

# checks if a pod is running
_pod_running() {
    local pod_name=$1
    local ready="false"
    local pod_status
    pod_status=$(oc get -n $OC_NAMESPACE $pod_name -o jsonpath='{.status.phase}')
    if [ "$pod_status" == "Running" ]; then
        ready="true"
    fi
    echo "$ready"
}

# polls deployments and pods for readiness before kicking off triage info collection
poll_deployments() {
    local succeeded="true"
    local deployment_list=$1
    local pod_list=$2
    local deployment_status
    for deployment in $deployment_list; do
        deployment_status=$(_health_check_deployment $deployment)
        if [ "$deployment_status" == "false" ]; then
            succeeded="false"
            break
        fi
    done
    for pod in $pod_list; do
        _pod_running=$(_pod_running $pod)
        if [ "$pod_status" == "false" ]; then
            succeeded="false"
            break
        fi
    done
    echo "$succeeded"
}

# iterates through deployments and finds their corresponding replicaset list
# verifies that the latest replicaset has ready replicas and that
# kubernetes did not quietly rollback to a previous replicaset
# Dependency: deployements and replicasets need the app.kubernetes.io/name label
on_latest_replicasets() {
    local deployment_list=$1
    local latest_replicaset
    local lrsr
    local app_name_labels
    app_name_labels=$(echo "$deployment_list" | xargs oc get -n $OC_NAMESPACE -ojson | jq -r '.items[].metadata.labels["app.kubernetes.io/name"]' | sort | uniq)
    for app_name in $app_name_labels; do
        latest_replicaset=$(oc get -n $OC_NAMESPACE replicaset -l app.kubernetes.io/name=$app_name,$LABEL_SELECTOR --sort-by=.metadata.creationTimestamp -ojson | jq -r '.items[-1].metadata.name')
        lrsr=$(oc get -n $OC_NAMESPACE replicaset $latest_replicaset -ojson | jq -r '.status.readyReplicas')
        if [ "$lrsr" -eq 0 ]; then
            echo_red "$(echo_cross) Deployment $app_name latest replicaset $latest_replicaset has 0 ready replicas"
            HEALTH_CHECK_PASSED=1
        else
            echo_green "$(echo_checkmark) Deployment $app_name latest replicaset $latest_replicaset in use with $lrsr ready replicas"
        fi
    done

}

# pods should be marked as ready and running to be considered healthy
all_pods_ready() {
    local pod_list=$1
    local pod_status
    for pod in $pod_list; do
        if [ "$(_pod_running $pod)" == "false" ]; then
            echo_red "$(echo_cross) Pod $pod has not finished startup and is not classified as running"
            HEALTH_CHECK_PASSED=1
        else
            echo_green "$(echo_checkmark) Pod $pod is running"
        fi
    done
}

# checks that pods aren't restarting during the release
no_pod_restarts() {
    local pod_list=$1
    local restarts
    for pod in $pod_list; do
        restarts=$(oc get -n $OC_NAMESPACE $pod -ojson | jq -r '.status.containerStatuses[].restartCount')
        if [ "$restarts" -gt 0 ]; then
            echo_red "$(echo_cross) Pod $pod has $restarts restarts!"
            HEALTH_CHECK_PASSED=1
            COMMANDS_TO_RUN+="\noc describe -n $OC_NAMESPACE $pod;"
        else
            echo_green "$(echo_checkmark) Pod $pod has no restarts"
        fi
    done
}

# simple heuristic check of pods under the label selector
# checks last 100 lines for error expression matches
no_error_logs() {
    local pod_list=$1
    local error_logs
    for pod in $pod_list; do
        error_logs=$(oc logs -n $OC_NAMESPACE $pod --all-containers --tail=100 --since=60m | grep -E "$ERROR_EXPR" || true)
        if [ -n "$error_logs" ]; then
            echo_red "$(echo_cross) Pod $pod has error logs"
            HEALTH_CHECK_PASSED=1
            COMMANDS_TO_RUN+="\noc logs -n $OC_NAMESPACE $pod --all-containers --tail=100 --since=60m | grep -E \"$ERROR_EXPR\" || true;"
        else
            echo_green "$(echo_checkmark) Pod $pod has no recent error logs"
        fi
    done
}

# fetches and filters all namespace events and attempts to find
# any non informational events related to the workloads rolled out by helm
# TODO: consider tweaking sensitivity of event filtering
no_associated_events() {
    local events=""
    # eg: app.kubernetes.io/instance=nr-compliance-enforcement-771 -> nr-compliance-enforcement-771
    local object_pattern
    object_pattern=$(echo "$LABEL_SELECTOR" | cut -d'=' -f2)
    local time_window
    time_window=$(date -u -d '30 minutes ago' +'%Y-%m-%dT%H:%M:%SZ')
    local event_summary=""
    local event_count=0
    local event_ln_check=0
    events=$(oc get events -n "$OC_NAMESPACE" -o json | jq '
        [.items[] | 
        select(
            .type == "Warning" and 
            (.lastTimestamp // .eventTime) >= "'$time_window'" and 
            .count >= 2
        ) | 
        {
            name: .involvedObject.name,
            message: .message,
            reason: .reason,
            count: .count,
            lastSeen: (.lastTimestamp // .eventTime)
        }]
    ')
    event_ln_check=$(echo "$events" | jq -r 'length')
    if [ "$event_ln_check" -gt 0 ]; then
        event_summary=$(echo -e "$events" | jq -r '.[] | [.name, .message, .reason] | @tsv')
        event_summary=$(echo -e "$event_summary" | grep "$object_pattern" || true)
        # exit out, found no applicable events after filtering
        if [ -z "$event_summary" ]; then
            echo_green "$(echo_checkmark) No warning-type events associated with release $object_pattern"
            return
        fi
        event_count=$(echo "$event_summary" | wc -l)
        echo_red "$(echo_cross) Found the following $event_count warning (error) events associated with this helm release:"
        echo -e "$event_summary" | sed 's/^/\t/' # tab indent the events for readability
        HEALTH_CHECK_PASSED=1
        COMMANDS_TO_RUN+="\noc get events -n $OC_NAMESPACE | grep -Ei $object_pattern;"
    else
        echo_green "$(echo_checkmark) No warning-type events associated with release $object_pattern"
    fi
}

# Creates a triage report for the rollout
# summarizing details and providing commands to run for more info if applicable
triage_rollout() {
    local deployment_list=$1
    local pod_list=$2
    local replicaset_list=$3
    local statefulset_list=$4
    echo_yellow "Status of workloads rolled out under $LABEL_SELECTOR:"
    on_latest_replicasets "$deployment_list"
    all_pods_ready "$pod_list"
    no_pod_restarts "$pod_list"
    no_error_logs "$pod_list"
    no_associated_events
    if [ "$COMMANDS_TO_RUN" != "" ]; then
        echo_yellow "Run these to get more information about pod logs or events:"
        echo -e "$COMMANDS_TO_RUN\n"
        echo ""
        echo_yellow "To remove log-related failures during your next rollout, delete any pods listed here."
        echo ""
    fi
    if [ "$TIMED_OUT" -eq 1 ]; then
        echo_red "Polling timed out, indicating the helm install was not successful or took too long to complete"
    fi
    echo_yellow "Triage complete."
    echo ""
    echo_yellow "Overall Health Check Status:"
    if [ "$HEALTH_CHECK_PASSED" -eq 1 ] || [ "$TIMED_OUT" -eq 1 ]; then
        echo_red "$(echo_cross) Health check failed"
    else
        echo_green "$(echo_checkmark) Health check passed"
    fi
}

main() {
    echo_yellow "Beginning Polled Health Check for Workloads labeled with $LABEL_SELECTOR..."
    echo_yellow "Polling timeout set to $TIMEOUT_SECONDS seconds on an periodic interval of $POLL_INTERVAL_SECONDS seconds."
    echo "..."
    local workload_list
    local deployment_list
    local pod_list
    local replicaset_list
    local statefulset_list
    local start_time
    workload_list=$(get_workload_list $LABEL_SELECTOR)
    echo_yellow "Found the following workloads to health check:"
    echo "---"
    echo "$workload_list"
    echo "---"
    if [ -z "$workload_list" ]; then
        echo_red "No workloads found to health check. Helm install could be stuck or not started yet!. Exiting..."
        exit 1
    fi
    deployment_list=$(echo -e "$workload_list" | grep "deployment")
    pod_list=$(echo -e "$workload_list" | grep "pod")
    start_time=$(date +%s)
    echo_yellow "Polling deployments:"
    echo "---"
    echo "$deployment_list"
    echo "---"
    echo_yellow "Beginning polling..."
    while [ "$(poll_deployments $deployment_list $pod)" == "false" ]; do
        echo "..."
        if [ $(($(date +%s) - $start_time)) -gt $TIMEOUT_SECONDS ]; then
            echo_red "One or more deployments did not finish within the timeout period!"
            echo_red "Collecting triage info..."
            TIMED_OUT=1
            break
        fi
        sleep $POLL_INTERVAL_SECONDS
    done
    echo_yellow "Polling finished..."
    replicaset_list=$(echo -e "$workload_list" | grep "replicaset")
    statefulset_list=$(echo -e "$workload_list" | grep "statefulset")
    triage_rollout "$deployment_list" "$pod_list" "$replicaset_list" "$statefulset_list"
    exit $HEALTH_CHECK_PASSED
}
main
