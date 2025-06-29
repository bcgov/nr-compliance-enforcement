### Backend Alerts
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_prod_cpu_quota" {
  name = "Prod Backend CPU Requests Quota Alert"
  description = "Alert when the CPU requests usage is too high"
  severity = "medium"
  query = "sysdig_container_cpu_quota_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-backend\",container_name=\"nr-compliance-enforcement-prod-backend\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_prod_mem_usage" {
  name = "Prod Backend Mem Usage Alert"
  description = "Alert when the mem usage is too high"
  severity = "medium"
  query = "sysdig_container_memory_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-backend\",container_name=\"nr-compliance-enforcement-prod-backend\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_prod_mem_limit" {
  name = "Prod Backend Mem Limit Alert"
  description = "Alert when the mem usage is near the limit for too long"
  severity = "high"
  query = "sysdig_container_memory_limit_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-backend\",container_name=\"nr-compliance-enforcement-prod-backend\"}  > 70"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_prod_http_silent" {
  name = "Prod Backend Unresponsive Alert"
  description = "Alert when the backend container has been unresponsive or silent for too long"
  severity = "high"
  query = "sysdig_container_net_http_request_count{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-backend\",container_name=\"nr-compliance-enforcement-prod-backend\"} < 0.1"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Backend"
    app = "NatCom"
  }
}
### Frontend Alerts
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_prod_cpu_quota" {
  name = "Prod Frontend CPU Requests Quota Alert"
  description = "Alert when the CPU requests usage is too high"
  severity = "medium"
  query = "sysdig_container_cpu_quota_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-frontend\",container_name=\"nr-compliance-enforcement-prod-frontend\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Frontend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_prod_mem_usage" {
  name = "Prod Frontend Mem Usage Alert"
  description = "Alert when the mem usage is too high"
  severity = "medium"
  query = "sysdig_container_memory_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-frontend\",container_name=\"nr-compliance-enforcement-prod-frontend\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Frontend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_prod_mem_limit" {
  name = "Prod Frontend Mem Limit Alert"
  description = "Alert when the mem usage is near the limit for too long"
  severity = "high"
  query = "sysdig_container_memory_limit_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-frontend\",container_name=\"nr-compliance-enforcement-prod-frontend\"}  > 70"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Frontend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_prod_http_silent" {
  name = "Prod Frontend Unresponsive Alert"
  description = "Alert when the frontend container has been unresponsive or silent for too long"
  severity = "high"
  query = "sysdig_container_net_http_request_count{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-frontend\",container_name=\"nr-compliance-enforcement-prod-frontend\"} < 0.1"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Frontend"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_prod_http_error_rate" {
  name = "Prod Frontend HTTP Error Rate Alert"
  description = "Alert when the frontend container has too many HTTP errors over a period"
  severity = "high"
  query = "(sysdig_container_net_http_error_count{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-frontend\"} / sysdig_container_net_http_request_count{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-frontend\"} ) > 0.05"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Frontend"
    app = "NatCom"
  }
}
### Database Alerts
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_prod_cpu_quota" {
  name = "Prod Database CPU Requests Quota Alert"
  description = "Alert when the CPU requests usage is too high"
  severity = "medium"
  query = "sysdig_container_cpu_quota_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"postgres-crunchy-prod\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_prod_mem_usage" {
  name = "Prod Database Mem Usage Alert"
  description = "Alert when the mem usage is too high"
  severity = "medium"
  query = "sysdig_container_memory_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"postgres-crunchy-prod\"}  > 98"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_prod_mem_limit" {
  name = "Prod Database Mem Limit Alert"
  description = "Alert when the mem usage is near the limit for too long"
  severity = "high"
  query = "sysdig_container_memory_limit_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"postgres-crunchy-prod\"}  > 70"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_prod_storage_usage" {
  name = "Prod Database Storage Alert"
  description = "Alert when the database storage usage is too high"
  severity = "high"
  query = "sysdig_fs_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"postgres-crunchy-prod\"} > 50"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_webeoc_prod_storage_usage" {
  name = "Prod Webeoc Custom Log Storage Alert"
  description = "Alert when the PVC storage usage is too high"
  severity = "high"
  query = "sysdig_fs_used_percent{kube_cluster_name=\"silver\",kube_namespace_name=\"c1c7ed-prod\",kube_deployment_name=\"nr-compliance-enforcement-prod-webeoc\"} > 70"
  enabled = true
  duration_seconds = 600
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Webeoc"
    app = "NatCom"
  }
}
### Kubernetes Critical Events
resource "sysdig_monitor_alert_v2_event" "nr_events_prod_failedimagepull" {
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
    values = ["c1c7ed-prod"]
  }
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  range_seconds = 600
}
resource "sysdig_monitor_alert_v2_event" "nr_events_prod_failedvolumeattach" {
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
    values = ["c1c7ed-prod"]
  }
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  range_seconds = 600
}