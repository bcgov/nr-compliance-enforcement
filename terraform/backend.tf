terraform {
    backend "s3" {
        region = "ca-central-1" # dummy value
        bucket = "override"
        key =  "override"
        access_key = "override"
        secret_key = "override"
        endpoint = "override"
        # avoid aws-specific api checks
        skip_credentials_validation = true
        skip_metadata_api_check = true
        skip_region_validation = true
        skip_requesting_account_id = true
        force_path_style = true
    }
}