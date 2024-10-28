resource "sysdig_monitor_notification_channel_email" "test_environment_alerts" {
    name                    = "Team Wolverine - Test Environment Alerts"
    recipients              = ["jonathan.funk@gov.bc.ca"]
    enabled                 = true
    notify_when_ok          = true
    notify_when_resolved    = true
    send_test_notification  = false
    share_with_current_team = true
}
resource "sysdig_monitor_notification_channel_email" "prod_environment_alerts" {
    name                    = "Team Wolverine - Prod Environment Alerts"
    recipients              = ["jonathan.funk@gov.bc.ca"]
    enabled                 = true
    notify_when_ok          = true
    notify_when_resolved    = true
    send_test_notification  = false
    share_with_current_team = true
}