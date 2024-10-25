resource "sysdig_monitor_notification_channel_email" "general_alerts" {
    name                    = "Team Wolverine - General"
    recipients              = ["jonathan.funk@gov.bc.ca"]
    enabled                 = true
    notify_when_ok          = true
    notify_when_resolved    = true
    send_test_notification  = false
    share_with_current_team = true
}