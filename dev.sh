#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[info]${NC} $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $*"; }
error() { echo -e "${RED}[error]${NC} $*" >&2; exit 1; }

wait_for_service() {
  local service="$1"
  local url="$2"
  local timeout="${3:-120}"
  local retries=0
  local max=$(( timeout / 2 ))
  info "Waiting for ${service}..."
  until docker exec "$service" curl -sf "$url" >/dev/null 2>&1; do
    retries=$((retries + 1))
    [[ $retries -gt $max ]] && {
      echo ""
      cmd_errors_for "$service"
      error "${service} not ready after ${timeout}s"
    }
    sleep 2
  done
  info "${service} ready."
}

ERROR_PATTERN='(npm ERR!|npm error|Error:|TypeError:|ReferenceError:|SyntaxError:|ECONNREFUSED|ENOTFOUND|EADDRINUSE|PrismaClient|Cannot find module|FATAL:|error TS)'
BAD_URL_PATTERN='(localhost|127\.0\.0\.1|host\.docker\.internal)'
FE_URL_EXCLUDE='^[0-9]*:(VITE_|E2E_|PLAYWRIGHT_|CYPRESS_)'

usage() {
  cat <<'EOF'
Usage: ./dev.sh <command> [options]

Commands:
  reset                         Full reset (see flow below)
  logs [service...]             Tail logs (default: all app services)
  errors                        Check all container logs for errors
  install                       Rerun npm install in frontend, backend, backend-cm
  prisma                        Run prisma-all in backend-cm container
  codegen                       Run GraphQL codegen in frontend container
  import                        Run import:all in backend-cm (parks, bclaws, federallaws)
  health                        Check env files and URLs for container setup issues
  pt <service> <command...>     Pass through any command to a running container

Reset flow (each step can be run individually):
  1. ./dev.sh health                         # check env files
  2. docker compose down -v                  # tear down containers + volumes
  3. docker compose up -d                    # start all (compose handles ordering)
  4. ./dev.sh prisma                         # pull + generate all prisma schemas
  5. ./dev.sh codegen                        # generate GraphQL types for frontend
  6. docker compose restart frontend         # restart frontend with generated types
  7. ./dev.sh errors                         # verify no errors

Examples:
  ./dev.sh logs frontend
  ./dev.sh logs backend backend-cm
  ./dev.sh codegen
  ./dev.sh prisma
  ./dev.sh pt backend npm run test
  ./dev.sh pt backend-cm npm run import:all
  ./dev.sh pt backend-cm npm run import:parks
  ./dev.sh pt backend-cm npm run import:bclaws
  ./dev.sh pt backend-cm npm run import:federallaws
  ./dev.sh pt frontend npm install axios
EOF
}

# nuke and recreate all containers
cmd_reset() {
  cmd_health || { error "Fix health issues before resetting."; }

  info "Tearing down..."
  docker compose down -v 2>/dev/null || true

  info "Starting all services (compose handles dependency ordering)..."
  docker compose up -d

  wait_for_service "backend-cm" "http://localhost:3000/api"

  cmd_prisma
  info "Awaiting backend-cm reload..."
  sleep 5
  wait_for_service "backend-cm" "http://localhost:3000/api"
  cmd_codegen
  info "Restarting frontend..."
  docker compose restart frontend
  sleep 5
  cmd_errors || true

  info "Reset complete!"
}

# helper for easy tailing
cmd_logs() {
  if [ $# -eq 0 ]; then
    docker compose logs -f frontend backend backend-cm webeoc event-worker
  else
    docker compose logs -f "$@"
  fi
}

# quickscan for errors in logs
cmd_errors_for() {
  local svc="$1"
  local hits
  hits=$(docker logs "$svc" 2>&1 | grep -E "$ERROR_PATTERN" | tail -20)
  if [[ -n "$hits" ]]; then
    echo -e "${RED}── ${svc} ──${NC}"
    echo "$hits"
    echo ""
    return 1
  fi
  return 0
}

# quickscan containers for error regex
cmd_errors() {
  local services=("frontend" "backend" "backend-cm" "webeoc" "event-worker" "database" "nats")
  local found=0
  for svc in "${services[@]}"; do
    cmd_errors_for "$svc" || found=1
  done
  if [[ $found -eq 0 ]]; then
    info "No errors found in any container logs."
  else
    exit 1
  fi
}

# install all node modules in-container
cmd_install() {
  info "Installing frontend..."
  docker exec frontend npm install
  info "Installing backend..."
  docker exec backend npm install --legacy-peer-deps
  info "Installing backend-cm..."
  docker exec backend-cm npm install --legacy-peer-deps
  info "Done."
}

# runs prisma gen in-container
cmd_prisma() {
  info "Running prisma-all in backend-cm..."
  docker exec backend-cm npm run prisma-all
}

# runs codegen in-container
cmd_codegen() {
  info "Running GraphQL codegen in frontend..."
  docker exec frontend npm run codegen
}

cmd_import() {
  info "Running import:all in backend-cm..."
  docker exec backend-cm npm run import:all
}

cmd_health() {
  local issues=0

  # Detect OS
  case "$(uname -s)" in
    Darwin*)  info "OS: macOS" ;;
    Linux*)   info "OS: Linux" ;;
    MINGW*|MSYS*|CYGWIN*) info "OS: Windows" ;;
    *)        warn "OS: Unknown ($(uname -s))" ;;
  esac

  # Check .env files exist
  local services=("frontend" "backend" "backend-cm" "webeoc" "event-worker")
  for svc in "${services[@]}"; do
    if [[ ! -f "${svc}/.env" ]]; then
      warn "Missing ${svc}/.env"
      issues=1
    else
      info "${svc}/.env exists"
    fi
  done

  # Verify .env URL ports match docker-compose.yml port mappings using yq
  if ! command -v yq &>/dev/null; then
    warn "yq not installed — skipping port validation (install: https://github.com/mikefarah/yq)"
  else
  info "Checking .env ports against docker-compose.yml..."
  local port_map
  port_map=$(yq '.services | to_entries[] | select(.value.ports) | .key + " " + (.value.ports[] | sub("\"", "") | sub("\"", ""))' docker-compose.yml 2>/dev/null)

  # Check container-to-container URLs use the right internal port
  local all_envs=("backend/.env" "backend-cm/.env" "webeoc/.env" "event-worker/.env")
  for envfile in "${all_envs[@]}"; do
    [[ ! -f "$envfile" ]] && continue
    while IFS= read -r line; do
      [[ "$line" =~ ^# ]] && continue
      local checked_svcs=""
      while IFS=' ' read -r svc mapping; do
        [[ "$checked_svcs" == *"|${svc}:${line}|"* ]] && continue
        local container_port="${mapping##*:}"
        if [[ "$line" =~ ${svc}:([0-9]+) ]]; then
          local url_port="${BASH_REMATCH[1]}"
          local all_container_ports
          all_container_ports=$(echo "$port_map" | grep "^${svc} " | awk '{split($2,a,":"); print a[2]}')
          if ! echo "$all_container_ports" | grep -qx "$url_port"; then
            warn "${envfile}: port ${url_port} for ${svc} doesn't match any compose internal port (expected: $(echo $all_container_ports | tr '\n' ','))"
            issues=1
          fi
          checked_svcs="${checked_svcs}|${svc}:${line}|"
        fi
      done <<< "$port_map"
    done < "$envfile"
  done

  # Check browser-side URLs (localhost:port) use the right host port
  if [[ -f "frontend/.env" ]]; then
    local host_port_list
    host_port_list=$(echo "$port_map" | awk '{split($2,a,":"); print a[1]}' | sort -u)
    while IFS= read -r line; do
      [[ "$line" =~ ^# ]] && continue
      if [[ "$line" =~ localhost:([0-9]+) ]]; then
        if ! echo "$host_port_list" | grep -qx "${BASH_REMATCH[1]}"; then
          warn "frontend/.env: localhost:${BASH_REMATCH[1]} doesn't match any compose host port"
          issues=1
        fi
      fi
    done < "frontend/.env"
  fi
  fi

  # Scan backend .env files for URLs that won't work in containers
  # (frontend VITE_* vars are browser-side so localhost is correct there)
  local backend_envs=("backend/.env" "backend-cm/.env" "webeoc/.env" "event-worker/.env")
  for envfile in "${backend_envs[@]}"; do
    [[ ! -f "$envfile" ]] && continue
    local bad_urls
    bad_urls=$(grep -nE "$BAD_URL_PATTERN" "$envfile" | grep -v '^[0-9]*:#' || true)
    if [[ -n "$bad_urls" ]]; then
      warn "${envfile} has URLs that won't work in containers:"
      echo "$bad_urls" | while read -r line; do
        echo "  $line"
      done
      issues=1
    fi
  done

  # Check frontend .env for non-VITE vars with localhost
  if [[ -f "frontend/.env" ]]; then
    local bad_fe
    # grep out commented lines in .env
    bad_fe=$(grep -nE "$BAD_URL_PATTERN" frontend/.env | grep -v '^[0-9]*:#' | grep -vE "$FE_URL_EXCLUDE" || true)
    if [[ -n "$bad_fe" ]]; then
      warn "frontend/.env has non-VITE URLs that won't work in containers:"
      echo "$bad_fe" | while read -r line; do
        echo "  $line"
      done
      issues=1
    fi
  fi

  # If containers are running, check service endpoints
  if docker ps --format '{{.Names}}' | grep -q frontend; then
    info "Containers detected — checking service endpoints..."
    local endpoints=(
      "frontend|http://localhost:3000"
      "backend|http://localhost:3001/api"
      "backend-cm|http://localhost:3003/api"
    )
    for entry in "${endpoints[@]}"; do
      local name="${entry%%|*}"
      local url="${entry##*|}"
      if curl -sf "$url" >/dev/null 2>&1; then
        info "${name} responding at ${url}"
      else
        warn "${name} not responding at ${url}"
        issues=1
      fi
    done

    # Frontend asset checks
    info "Checking frontend assets..."
    local fe_assets=(
      "complaint page|http://localhost:3000/complaint/"
      "app CSS|http://localhost:3000/src/assets/sass/app.compiled.css"
      "user-mgmt CSS|http://localhost:3000/src/assets/sass/user-management.compiled.css"
      "hwcr-assessment CSS|http://localhost:3000/src/assets/sass/hwcr-assessment.compiled.css"
      "BC Sans font|http://localhost:3000/src/assets/fonts/bc-sans-regular.woff"
      "bootstrap icons|http://localhost:3000/node_modules/bootstrap-icons/font/bootstrap-icons.css"
      "index.tsx|http://localhost:3000/src/index.tsx"
    )
    for entry in "${fe_assets[@]}"; do
      local name="${entry%%|*}"
      local url="${entry##*|}"
      if curl -sf --max-time 10 -o /dev/null "$url" 2>&1; then
        info "${name} OK"
      else
        warn "${name} FAILED (${url})"
        issues=1
      fi
    done
  fi

  if [[ $issues -eq 0 ]]; then
    info "All checks passed."
  else
    exit 1
  fi
}

# helper func to make it easy for devs to pass through commands to in-container
cmd_pt() {
  [[ $# -lt 2 ]] && error "Usage: ./dev.sh pt <service> <command...>"
  local service="$1"; shift
  docker exec "$service" "$@"
}

case "${1:-}" in
  reset)    cmd_reset ;;
  logs)     shift; cmd_logs "$@" ;;
  errors)   cmd_errors ;;
  install)  cmd_install ;;
  prisma)   cmd_prisma ;;
  codegen)  cmd_codegen ;;
  import)   cmd_import ;;
  health)   cmd_health ;;
  pt)       shift; cmd_pt "$@" ;;
  -h|--help|help|"") usage ;;
  *)        error "Unknown command: $1 — run ./dev.sh help" ;;
esac
