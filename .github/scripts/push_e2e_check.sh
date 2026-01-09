#!/bin/bash
set -euo pipefail

# Usage: ./post-check-status.sh <return_code> <pr_number>
# Environment variables required:
#   PUSH_GITHUB_REPO    - e.g., "bcgov/nr-compliance-enforcement"
#   E2E_GITHUB_TOKEN   - token with statuses:write permission
#   E2E_HTTPS_PROXY

# If return_code < 0, then the script will short circuit and push a pending/running check status

RETURN_CODE="${1:?Error: return code required as first argument}"
PR_NUMBER="${2:?Error: PR number required as second argument}"

: "${PUSH_GITHUB_REPO:?Error: PUSH_GITHUB_REPO environment variable not set}"
: "${E2E_GITHUB_TOKEN:?Error: E2E_GITHUB_TOKEN environment variable not set}"

CHECK_CONTEXT="PR / emerald-e2e-playwright-tests"
API_BASE="https://api.github.com/repos/${PUSH_GITHUB_REPO}"

CURL_OPTS=""
if [[ -z "${E2E_HTTPS_PROXY}" ]]; then
  CURL_OPTS="-x ${E2E_HTTPS_PROXY}"
fi

HEADERS=(
  -H "Accept: application/vnd.github+json"
  -H "Authorization: Bearer ${E2E_GITHUB_TOKEN}"
  -H "X-GitHub-Api-Version: 2022-11-28"
)
echo "Starting Status Push to GitHub PR..."
# Fetch the HEAD commit SHA from the PR
echo "Fetching commit SHA for PR #${PR_NUMBER}..."
PR_RESPONSE=$(curl "${CURL_OPTS}" "${HEADERS[@]}" "${API_BASE}/pulls/${PR_NUMBER}")
echo "PR Response: ${PR_RESPONSE}"
COMMIT_SHA=$(echo "${PR_RESPONSE}" | grep -o '"sha": "[^"]*"' | head -1 | cut -d'"' -f4)

if [[ -z "${COMMIT_SHA}" ]]; then
  echo "Error: Could not extract commit SHA from PR #${PR_NUMBER}" >&2
  exit 1
fi

echo "Found commit SHA: ${COMMIT_SHA}"

# Determine status based on return code
if [[ "${RETURN_CODE}" -lt 0 ]]; then
  STATE="pending"
  DESCRIPTION="E2E tests are running, see E2E links for details"
elif [[ "${RETURN_CODE}" -eq 0 ]]; then
  STATE="success"
  DESCRIPTION="All tests passed, see E2E links for details"
else
  STATE="failure"
  DESCRIPTION="Tests failed with exit code ${RETURN_CODE}, see E2E links for details"
fi

# Build the JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
  "state": "${STATE}",
  "description": "${DESCRIPTION}",
  "context": "${CHECK_CONTEXT}"
}
EOF
)

# Post the status
echo "Posting JSON to PR #${PR_NUMBER}..."
echo "${JSON_PAYLOAD}"
curl "${CURL_OPTS}" "${HEADERS[@]}" \
  -X POST \
  "${API_BASE}/statuses/${COMMIT_SHA}" \
  -d "${JSON_PAYLOAD}"

echo ""
echo "Successfully posted '${STATE}' status to PR #${PR_NUMBER} (${COMMIT_SHA:0:7})"