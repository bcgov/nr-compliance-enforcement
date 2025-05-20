### Backend Alerts
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_test_cpu_quota" {
  name = "Test Backend CPU Requests Quota Alert"
  description = "Alert when the CPU requests usage is too high"
  severity = "medium"
  query = "sysdig_container_cpu_quota_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-backend\",container_name=\"nr-compliance-enforcement-test-backend\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_test_mem_usage" {
  name = "Test Backend Mem Usage Alert"
  description = "Alert when the mem usage is too high"
  severity = "medium"
  query = "sysdig_container_memory_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-backend\",container_name=\"nr-compliance-enforcement-test-backend\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_test_mem_limit" {
  name = "Test Backend Mem Limit Alert"
  description = "Alert when the mem usage is near the limit for too long"
  severity = "high"
  query = "sysdig_container_memory_limit_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-backend\",container_name=\"nr-compliance-enforcement-test-backend\"}  > 70"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_test_http_silent" {
  name = "Test Backend Unresponsive Alert"
  description = "Alert when the backend container has been unresponsive or silent for too long"
  severity = "high"
  query = "sysdig_container_net_http_request_count{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-backend\",container_name=\"nr-compliance-enforcement-test-backend\"} < 0.1"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
### Frontend Alerts
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_test_cpu_quota" {
  name = "Test Frontend CPU Requests Quota Alert"
  description = "Alert when the CPU requests usage is too high"
  severity = "medium"
  query = "sysdig_container_cpu_quota_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-frontend\",container_name=\"nr-compliance-enforcement-test-frontend\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Frontend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_test_mem_usage" {
  name = "Test Frontend Mem Usage Alert"
  description = "Alert when the mem usage is too high"
  severity = "medium"
  query = "sysdig_container_memory_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-frontend\",container_name=\"nr-compliance-enforcement-test-frontend\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Frontend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_test_mem_limit" {
  name = "Test Frontend Mem Limit Alert"
  description = "Alert when the mem usage is near the limit for too long"
  severity = "high"
  query = "sysdig_container_memory_limit_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-frontend\",container_name=\"nr-compliance-enforcement-test-frontend\"}  > 70"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Frontend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_test_http_silent" {
  name = "Test Frontend Unresponsive Alert"
  description = "Alert when the frontend container has been unresponsive or silent for too long"
  severity = "high"
  query = "sysdig_container_net_http_request_count{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-frontend\",container_name=\"nr-compliance-enforcement-test-frontend\"} < 0.1"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Frontend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_test_http_error_rate" {
  name = "Test Frontend HTTP Error Rate Alert"
  description = "Alert when the frontend container has too many HTTP errors over a period"
  severity = "high"
  query = "(sysdig_container_net_http_error_count{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-frontend\"} / sysdig_container_net_http_request_count{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-frontend\"} ) > 0.05"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Frontend"
    app = "NatCom"
  }
}
### Databsae Alerts
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_test_cpu_quota" {
  name = "Test Database CPU Requests Quota Alert"
  description = "Alert when the CPU requests usage is too high"
  severity = "medium"
  query = "sysdig_container_cpu_quota_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"postgres-crunchy-test\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_test_mem_usage" {
  name = "Test Database Mem Usage Alert"
  description = "Alert when the mem usage is too high"
  severity = "medium"
  query = "sysdig_container_memory_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"postgres-crunchy-test\"}  > 98"
  enabled = true
  duration_seconds = 180
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_test_mem_limit" {
  name = "Test Database Mem Limit Alert"
  description = "Alert when the mem usage is near the limit for too long"
  severity = "high"
  query = "sysdig_container_memory_limit_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"postgres-crunchy-test\"}  > 70"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_test_storage_usage" {
  name = "Test Database Storage Alert"
  description = "Alert when the database storage usage is too high"
  severity = "high"
  query = "sysdig_fs_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"postgres-crunchy-test\"} > 70"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_webeoc_test_storage_usage" {
  name = "Test Webeoc Custom Log Storage Alert"
  description = "Alert when the PVC storage usage is too high"
  severity = "high"
  query = "sysdig_fs_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-test\",kube_deployment_name=\"nr-compliance-enforcement-test-webeoc\"} > 70"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Webeoc"
    app = "NatCom"
  }
}
### Kubernetes Critical Events
resource "sysdig_monitor_alert_v2_event" "nr_events_test_failedimagepull" {
  name = "Failed to pull image"
  description = "A Kubernetes pod failed to pull an image from the registry"
  severity = "high"
  filter = "Failed to pull image"
  sources = ["kubernetes"]
  operator = ">"
  threshold = 2
  group_by = ["kube_pod_name"]
  scope {
    label = "kube_namespace_name"
    operator = "in"
    values = ["c1c7ed-test"]
  }
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  range_seconds = 600
}
resource "sysdig_monitor_alert_v2_event" "nr_events_test_failedvolumeattach" {
  name = "Failed to attach to volume within deadline"
  description = "A pod was unable to attach to its specified volume within the schedule"
  severity = "high"
  filter = "Attach failed for volume"
  sources = ["kubernetes"]
  operator = ">"
  threshold = 1
  group_by = ["kube_pod_name"]
  scope {
    label = "kube_namespace_name"
    operator = "in"
    values = ["c1c7ed-test"]
  }
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  range_seconds = 600
}