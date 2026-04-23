#!/usr/bin/env bash
# Resolve a release branch's HEAD to a (sha, pr, tag) triple for trunk releases.
# Args: <release_branch>   e.g. release/2.22
# Env:  GITHUB_REPOSITORY  e.g. bcgov/nr-compliance-enforcement (required)
#       GITHUB_OUTPUT      optional; if set, writes sha/pr/tag in GitHub Actions format
#       GH_TOKEN           required by `gh api` (passed through to sha-to-pr.sh)
#
# Exits non-zero if the branch is missing or the PR cannot be resolved.

set -euo pipefail

release_branch="${1:?usage: resolve-release-pr.sh <release_branch>}"
repo="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY must be set}"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Repo:           $repo"
echo "Release branch: $release_branch"

if ! git show-ref --verify --quiet "refs/remotes/origin/${release_branch}"; then
  echo "Release branch $release_branch does not exist on origin" >&2
  exit 1
fi

sha=$(git rev-parse "origin/${release_branch}")
echo "Resolved SHA:   $sha"

pr=$("${script_dir}/sha-to-pr.sh" "$sha")
echo "Resolved PR:    $pr"

# Latest semver tag pointing at this SHA, if any (for GitHub Release naming).
tag=$(git tag --points-at "$sha" "v*.*.*" | sort -V | tail -n1 || true)
echo "Tag at SHA:     ${tag:-<none>}"

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  {
    echo "sha=$sha"
    echo "pr=$pr"
    echo "tag=$tag"
  } >> "$GITHUB_OUTPUT"
fi
