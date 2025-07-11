### Backend Alerts
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_emerald_prod_cpu_quota" {
  name = "EMERALD PROD - Backend CPU Requests Quota Alert"
  description = "Alert when the CPU requests usage is too high"
  severity = "medium"
  query = "sysdig_container_cpu_quota_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-backend\",container_name=\"f208ae-prod-natsuite-backend\"}  > 98"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_emerald_prod_mem_usage" {
  name = "EMERALD PROD - Backend Mem Usage Alert"
  description = "Alert when the mem usage is too high"
  severity = "medium"
  query = "sysdig_container_memory_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-backend\",container_name=\"f208ae-prod-natsuite-backend\"}  > 98"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_emerald_prod_mem_limit" {
  name = "EMERALD PROD - Backend Mem Limit Alert"
  description = "Alert when the mem usage is near the limit for too long"
  severity = "high"
  query = "sysdig_container_memory_limit_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-backend\",container_name=\"f208ae-prod-natsuite-backend\"}  > 70"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_backend_emerald_prod_http_silent" {
  name = "EMERALD PROD - Backend Unresponsive Alert"
  description = "Alert when the backend container has been unresponsive or silent for too long"
  severity = "high"
  query = "sysdig_container_net_http_request_count{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-backend\",container_name=\"f208ae-prod-natsuite-backend\"} < 0.1"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_emerald_prod_cpu_quota" {
  name = "EMERALD PROD - Frontend CPU Requests Quota Alert"
  description = "Alert when the CPU requests usage is too high"
  severity = "medium"
  query = "sysdig_container_cpu_quota_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-frontend\",container_name=\"f208ae-prod-natsuite-frontend\"}  > 98"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_emerald_prod_mem_usage" {
  name = "EMERALD PROD - Frontend Mem Usage Alert"
  description = "Alert when the mem usage is too high"
  severity = "medium"
  query = "sysdig_container_memory_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-frontend\",container_name=\"f208ae-prod-natsuite-frontend\"}  > 98"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_emerald_prod_mem_limit" {
  name = "EMERALD PROD - Frontend Mem Limit Alert"
  description = "Alert when the mem usage is near the limit for too long"
  severity = "high"
  query = "sysdig_container_memory_limit_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-frontend\",container_name=\"f208ae-prod-natsuite-frontend\"}  > 70"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_emerald_prod_http_silent" {
  name = "EMERALD PROD - Frontend Unresponsive Alert"
  description = "Alert when the frontend container has been unresponsive or silent for too long"
  severity = "high"
  query = "sysdig_container_net_http_request_count{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-frontend\",container_name=\"f208ae-prod-natsuite-frontend\"} < 0.1"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_frontend_emerald_prod_http_error_rate" {
  name = "EMERALD PROD - Frontend HTTP Error Rate Alert"
  description = "Alert when the frontend container has too many HTTP errors over a period"
  severity = "high"
  query = "(sysdig_container_net_http_error_count{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-frontend\"} / sysdig_container_net_http_request_count{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-frontend\"} ) > 0.05"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_emerald_prod_cpu_quota" {
  name = "EMERALD PROD - Database CPU Requests Quota Alert"
  description = "Alert when the CPU requests usage is too high"
  severity = "medium"
  query = "sysdig_container_cpu_quota_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"f208ae-prod-crunchy\"}  > 98"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_emerald_prod_mem_usage" {
  name = "EMERALD PROD - Database Mem Usage Alert"
  description = "Alert when the mem usage is too high"
  severity = "medium"
  query = "sysdig_container_memory_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"f208ae-prod-crunchy\"}  > 98"
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
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_emerald_prod_mem_limit" {
  name = "EMERALD PROD - Database Mem Limit Alert"
  description = "Alert when the mem usage is near the limit for too long"
  severity = "high"
  query = "sysdig_container_memory_limit_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"f208ae-prod-crunchy\"}  > 70"
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
/*
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_emerald_prod_storage_usage" {
  name = "EMERALD PROD - Database Storage Alert"
  description = "Alert when the database storage usage is too high"
  severity = "high"
  query = "sysdig_fs_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"f208ae-prod-crunchy\"} > 50"
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
*/
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_emerald_prod_up" {
  name = "EMERALD PROD - Database Up Alert"
  description = "Alert when the database is not returning up"
  severity = "high"
  query = "min(pg_up{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"f208ae-prod-crunchy\"}) == 0"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_emerald_prod_replication_lag" {
  name = "EMERALD PROD - Database Replication Lag Alert"
  description = "Alert when the database replication lag is presistantly high"
  severity = "high"
  query = "pg_replication_lag_seconds{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"f208ae-prod-crunchy\"} > 3"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_emerald_prod_wal_size" {
  name = "EMERALD PROD - Database WAL Size Alert"
  description = "Alert when the database WAL file is presistantly high"
  severity = "high"
  query = "max(pg_wal_size_bytes{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"f208ae-prod-crunchy\"}) > 800000000"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_emerald_prod_deadlocks" {
  name = "EMERALD PROD - Database Deadlock Alert"
  description = "Alert when the database has unresolved deadlocks"
  severity = "high"
  query = "max(pg_stat_database_deadlocks{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"f208ae-prod-crunchy\"}) >= 1"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_database_emerald_prod_lockcount" {
  name = "EMERALD PROD - Database Lock Count Alert"
  description = "Alert when the database has a high number of locks"
  severity = "medium"
  query = "max(pg_locks_count{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_statefulset_label_postgres_operator_crunchydata_com_cluster=\"f208ae-prod-crunchy\"}) >= 20"
  enabled = true
  duration_seconds = 300
  notification_channels {
    id = sysdig_monitor_notification_channel_email.test_environment_alerts.id
    renotify_every_minutes = 1440
  }
  labels = {
    service = "NatCom Database"
    app = "NatCom"
  }
}
resource "sysdig_monitor_alert_v2_prometheus" "nr_webeoc_emerald_prod_storage_usage" {
  name = "EMERALD PROD - Webeoc Custom Log Storage Alert"
  description = "Alert when the PVC storage usage is too high"
  severity = "high"
  query = "sysdig_fs_used_percent{kube_cluster_name=\"emerald\",kube_namespace_name=\"f208ae-prod\",kube_deployment_name=\"f208ae-prod-natsuite-webeoc\"} > 70"
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
resource "sysdig_monitor_alert_v2_event" "nr_events_emerald_prod_failedimagepull" {
  name = "EMERALD PROD - Failed to pull image"
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
    values = ["f208ae-prod"]
  }
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  range_seconds = 600
}
resource "sysdig_monitor_alert_v2_event" "nr_events_emerald_prod_failedvolumeattach" {
  name = "EMERALD PROD - Failed to attach to volume within deadline"
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
    values = ["f208ae-prod"]
  }
  notification_channels {
    id = sysdig_monitor_notification_channel_email.prod_environment_alerts.id
    renotify_every_minutes = 1440
  }
  range_seconds = 600
}