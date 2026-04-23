#!/usr/bin/env bash
# Resolve a commit SHA to its originating PR number.
# Args: <sha>
# Env:  GITHUB_REPOSITORY  e.g. bcgov/nr-compliance-enforcement (required)
#       GH_TOKEN           required by `gh api` (Actions sets this when env: GH_TOKEN is provided)
#
# Stdout: PR number (digits only) on success
# Exits non-zero (and prints diagnostics to stderr) if no PR can be resolved.
#
# Resolution strategy, in order:
#   1. GitHub API filtered by merge_commit_sha == <sha>  (correct under squash merges,
#      immune to the SHA appearing in unrelated PRs e.g. via cherry-picks or branch reuse).
#   2. Parse `(#N)` suffix from the commit subject  (squash-merge GitHub default).
#   3. Parse `Merge pull request #N` prefix         (merge-commit GitHub default).
# Rebase-and-merge cannot be resolved by either path and will exit non-zero.

set -euo pipefail

sha="${1:?usage: sha-to-pr.sh <sha>}"
repo="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY must be set}"

pr=$(gh api "repos/${repo}/commits/${sha}/pulls" \
  --jq ".[] | select(.merge_commit_sha == \"${sha}\") | .number" \
  | head -n1)

if [ -z "${pr}" ]; then
  subject=$(git log -1 --format=%s "${sha}" 2>/dev/null || true)
  pr=$(echo "$subject" | grep -oP '\(#\K\d+(?=\)\s*$)') || true
  [ -z "$pr" ] && pr=$(echo "$subject" | grep -oP '^Merge pull request #\K\d+') || true
fi

if [[ ! "${pr}" =~ ^[0-9]+$ ]]; then
  echo "sha-to-pr: could not resolve PR number for ${sha} in ${repo}" >&2
  exit 1
fi

echo "$pr"
