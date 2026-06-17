#!/usr/bin/env bash
#
# pull.sh — download every workflow from n8n into workflows/ as pretty-printed JSON for version
# control. Writes the clean, pushable shape only (name/nodes/connections/settings[/staticData]) —
# the exact fields push.sh sends — so a pull -> push round-trips. Ids and server-side state
# (active, timestamps, versionId, ownership) are dropped; push.sh re-matches by name.
#
# Expects the n8n API reachable — a port-forward (oc port-forward svc/n8n 5678:5678) or set
# N8N_URL to the n8n route directly.
#
# Auth: create an API key in the n8n UI (Settings -> n8n API) and export
# N8N_API_KEY before running.

set -euo pipefail

if ((BASH_VERSINFO[0] < 4)); then
  echo "Error: bash >= 4 required" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
N8N_URL="${N8N_URL:-http://localhost:5678}"

usage() {
  cat <<'EOF'
Usage: pull.sh [--prune] [dest-dir]

Downloads every n8n workflow to <dest-dir>/<workflow-name>.json in the clean,
pushable shape (name/nodes/connections/settings) that push.sh re-matches by name.
Ids and server state are dropped. Names should be unique (a duplicate warns and overwrites).

Arguments:
  dest-dir     Destination directory; overrides N8N_WORKFLOWS_DIR
               (default: workflows/ next to this script)

Options:
  --prune      Delete local .json files whose workflow no longer exists in n8n
  -h, --help   Show this help

Environment:
  N8N_URL            Base URL of n8n (default: http://localhost:5678)
  N8N_API_KEY        API key (required); create one in the n8n UI under Settings -> n8n API
  N8N_WORKFLOWS_DIR  Default destination directory
EOF
}

PRUNE=false
DEST_DIR=""
for arg in "$@"; do
  case "$arg" in
    --prune) PRUNE=true ;;
    -h|--help) usage; exit 0 ;;
    -*)
      echo "Unknown argument: $arg" >&2
      usage >&2
      exit 1
      ;;
    *)
      if [[ -n "$DEST_DIR" ]]; then
        echo "Error: more than one destination directory given" >&2
        usage >&2
        exit 1
      fi
      DEST_DIR="$arg"
      ;;
  esac
done

WORKFLOWS_DIR="${DEST_DIR:-${N8N_WORKFLOWS_DIR:-$SCRIPT_DIR/workflows}}"

command -v jq >/dev/null 2>&1 || { echo "Error: jq is required" >&2; exit 1; }

if [[ -z "${N8N_API_KEY:-}" ]]; then
  echo "Error: N8N_API_KEY is not set" >&2
  echo "(create an API key in the n8n UI under Settings -> n8n API, then: export N8N_API_KEY=<key>)" >&2
  exit 1
fi

# Fail fast with a useful hint when the port-forward isn't up.
curl -sS -o /dev/null --max-time 5 "$N8N_URL/healthz" || {
  echo "Error: cannot reach n8n at $N8N_URL — is the port-forward running?" >&2
  echo "  e.g. oc port-forward svc/n8n 5678:5678" >&2
  exit 1
}

# api METHOD PATH [extra curl args...] — prints the response body; on
# HTTP >= 400 prints n8n's error message to stderr and returns non-zero.
api() {
  local method="$1" path="$2"
  shift 2
  local response status body
  response="$(curl -sS -X "$method" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Accept: application/json" \
    -w $'\n%{http_code}' \
    "$@" \
    "$N8N_URL/api/v1$path")"
  status="${response##*$'\n'}"
  body="${response%$'\n'*}"
  if [[ ! "$status" =~ ^[0-9]+$ ]] || [ "$status" -ge 400 ]; then
    echo "Error: $method $path -> HTTP $status" >&2
    jq -r '.message // .' <<<"$body" >&2 2>/dev/null || printf '%s\n' "$body" >&2
    return 1
  fi
  printf '%s' "$body"
}

slugify() {
  local s
  s="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"
  printf '%s' "${s:-workflow}"
}

mkdir -p "$WORKFLOWS_DIR"

declare -A written # basenames written this run (for --prune + duplicate-name detection)
count=0
cursor=""

while :; do
  query=(-G --data-urlencode "limit=250")
  if [[ -n "$cursor" ]]; then
    query+=(--data-urlencode "cursor=$cursor")
  fi
  page="$(api GET /workflows "${query[@]}")"

  mapfile -t rows < <(jq -c '.data[]' <<<"$page")
  for row in "${rows[@]}"; do
    name="$(jq -r '.name' <<<"$row")"
    slug="$(slugify "$name")"
    file="$WORKFLOWS_DIR/$slug.json"
    if [[ -n "${written["$slug.json"]:-}" ]]; then
      echo "  warning: duplicate name '$name' — overwriting $file (names must be unique for push)" >&2
    fi
    # Write ONLY the fields push.sh sends (its build_body), so a pull -> push round-trips and
    # never carries an id or server-side state into git. -S keeps key order stable across pulls.
    jq -S '{name, nodes, connections, settings: (.settings // {})}
           + (if .staticData != null then {staticData} else {} end)' <<<"$row" >"$file"
    written["$slug.json"]=1
    count=$((count + 1))
    echo "  pulled: $name -> $file"
  done

  cursor="$(jq -r '.nextCursor // empty' <<<"$page")"
  [[ -n "$cursor" ]] || break
done

if [[ "$PRUNE" == true ]]; then
  shopt -s nullglob
  for f in "$WORKFLOWS_DIR"/*.json; do
    base="$(basename "$f")"
    if [[ -z "${written[$base]:-}" ]]; then
      rm "$f"
      echo "  pruned: $base (workflow no longer exists in n8n)"
    fi
  done
  shopt -u nullglob
fi

echo "Pulled $count workflow(s) into $WORKFLOWS_DIR"
