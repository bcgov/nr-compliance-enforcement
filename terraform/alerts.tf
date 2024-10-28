#### TEST
### Backend Alerts
resource "sysdig_monitor_alert_v2_prometheus" "backend_test_cpu_quota" {
  name = "Backend CPU Requests Quota Alert"
  description = "Alert when the CPU requests usage is too high"
  severity = "medium"
  query = "sysdig_container_cpu_quota_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-backend\",container_name=\"nr-compliance-enforcement-test-backend\"}  > 90"
  enabled = true
  duration_seconds = 30
  notification_channels {
    id = sysdig_monitor_notification_channel_email.general_alerts.id
    renotify_every_minutes = 120
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "backend_test_mem_usage" {
  name = "Backend Mem Usage Alert"
  description = "Alert when the mem usage is too high"
  severity = "medium"
  query = "sysdig_container_memory_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-backend\",container_name=\"nr-compliance-enforcement-test-backend\"}  > 90"
  enabled = true
  duration_seconds = 30
  notification_channels {
    id = sysdig_monitor_notification_channel_email.general_alerts.id
    renotify_every_minutes = 120
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "backend_test_mem_limit" {
  name = "Backend Mem Limit Alert"
  description = "Alert when the mem usage is near the limit for too long"
  severity = "high"
  query = "sysdig_container_memory_limit_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-backend\",container_name=\"nr-compliance-enforcement-test-backend\"}  > 70"
  enabled = true
  duration_seconds = 30
  notification_channels {
    id = sysdig_monitor_notification_channel_email.general_alerts.id
    renotify_every_minutes = 120
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "backend_test_uptime_score" {
  name = "Backend Uptime Alert"
  description = "Alert when the backend container has too much downtime"
  severity = "high"
  query = "sysdig_container_up{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-backend\",container_name=\"nr-compliance-enforcement-test-backend\"} < 0.7"
  enabled = true
  duration_seconds = 30
  notification_channels {
    id = sysdig_monitor_notification_channel_email.general_alerts.id
    renotify_every_minutes = 120
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "backend_test_http_silent" {
  name = "Backend Unresponsive Alert"
  description = "Alert when the backend container has been unresponsive or silent for too long"
  severity = "high"
  query = "sysdig_container_net_http_request_count{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-backend\",container_name=\"nr-compliance-enforcement-test-backend\"} < 0.1"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.general_alerts.id
    renotify_every_minutes = 120
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}