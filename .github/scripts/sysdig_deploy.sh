#!/bin/bash
# Handles sysdig terraform validation and apply

set -e # failfast
# ENV:
# APPLY: determines if plan is applied, lease as false for dry-run

cd terraform || exit 1
terraform -v
terraform init \
    -backend-config="bucket=${STATE_BACKEND_BUCKET}" \
    -backend-config="key=${STATE_BACKEND_FILEPATH}" \
    -backend-config="access_key=${STATE_BACKEND_ACCESS_KEY}" \
    -backend-config="secret_key=${STATE_BACKEND_SECRET_KEY}" \
    -backend-config="endpoint=${STATE_BACKEND_ENDPOINT}"

# validate and lint check
terraform validate
terraform plan

if [ "$APPLY" = "true" ]; then
    echo "APPLY=true flag provided, attempting to apply changes"
    # deploy
    terraform apply -auto-approve
else
    echo "Dry-run, skipping apply"
fi