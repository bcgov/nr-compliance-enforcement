resource "sysdig_monitor_notification_channel_email" "test_environment_alerts" {
    name                    = "Team Wolverine - Test Environment Alerts"
    recipients              = ["jonathan.funk@gov.bc.ca", "alec.2.wilcox@gov.bc.ca", "ryan.rondeau@gov.bc.ca", "mike.vesprini@gov.bc.ca", "scarlett.truong@gov.bc.ca", "dmitri.korin@gov.bc.ca"]
    enabled                 = true
    notify_when_ok          = true
    notify_when_resolved    = true
    send_test_notification  = false
    share_with_current_team = true
}
resource "sysdig_monitor_notification_channel_email" "prod_environment_alerts" {
    name                    = "Team Wolverine - Prod Environment Alerts"
    recipients              = ["jonathan.funk@gov.bc.ca", "alec.2.wilcox@gov.bc.ca", "ryan.rondeau@gov.bc.ca", "mike.vesprini@gov.bc.ca", "scarlett.truong@gov.bc.ca", "dmitri.korin@gov.bc.ca"]
    enabled                 = true
    notify_when_ok          = true
    notify_when_resolved    = true
    send_test_notification  = false
    share_with_current_team = true
}