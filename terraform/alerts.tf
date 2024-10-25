resource "sysdig_monitor_alert_v2_metric" "all_containers_high_cpu" {
  name = "General Container CPU Usage Alert"
  severity = "medium"
  metric = "sysdig_container_cpu_quota_used_percent"
  group_aggregation = "max"
  time_aggregation = "max"
  operator = ">"
  threshold = 80
  group_by = ["container_name"]

  scope {
    label = "kube_cluster_name"
    operator = "in"
    values = ["c1c7ed-test", "c1c7ed-prod"]
  }

  notification_channels {
    id = sysdig_monitor_notification_channel_email.general_alerts.id
    renotify_every_minutes = 120
  }
  range_seconds = 300
}