terraform {
  required_providers {
    sysdig = {
      source = "sysdiglabs/sysdig"
      version = ">=0.5"
    }
  }
}
provider "sysdig" {
  sysdig_monitor_url = "https://app.sysdigcloud.com"
  sysdig_monitor_api_token = var.sysdig_api_token
}