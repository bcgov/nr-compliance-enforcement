#!/bin/sh
# Local docker-compose entrypoint. Prod uses the Dockerfile; keep the pinned packages in sync with it.
set -e

# Prisma needs OpenSSL; curl is for the health check and network debugging.
# procps: `nest start --watch` uses `ps` to kill the old app on reload; without it the
# old process keeps port 3000 and every reload fails with EADDRINUSE
if ! command -v curl >/dev/null || ! command -v ps >/dev/null; then
  echo "[entrypoint] Installing pinned OpenSSL, curl and procps from the Debian snapshot..."
  sed -i 's|http://deb.debian.org/debian-security|http://snapshot.debian.org/archive/debian-security/20261027T000000Z|; s|http://deb.debian.org/debian|http://snapshot.debian.org/archive/debian/20261027T000000Z|' /etc/apt/sources.list.d/debian.sources
  apt-get -o Acquire::Check-Valid-Until=false update
  apt-get install -y --no-install-recommends \
    openssl=3.0.22-1~deb12u2 libssl3=3.0.22-1~deb12u2 \
    curl=7.88.1-10+deb12u15 libcurl4=7.88.1-10+deb12u15 \
    procps=2:4.0.2-3 libproc2-0=2:4.0.2-3
  rm -rf /var/lib/apt/lists/*
fi

echo "[entrypoint] Installing dependencies..."
npm i

echo "[entrypoint] Generating Prisma clients..."
npm run prisma-generate-complaint-outcome
npm run prisma-generate-shared
npm run prisma-generate-investigation
npm run prisma-generate-inspection

echo "[entrypoint] Starting dev server..."
exec npm run start:dev
