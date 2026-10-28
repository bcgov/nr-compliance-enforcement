# Build static files
# Node Bookwork has npm
# node:22-bookworm-slim as of 2026-10-19
FROM node@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392 AS buildwithdevdeps

# Prisma requires OpenSSL, which is not included in the slim image
# Pinned via the Debian snapshot archive so the version can't disappear from the mirror.
# To upgrade, bump the snapshot date and versions together (also backend/Dockerfile and the docker-entrypoint.sh scripts)
RUN sed -i 's|http://deb.debian.org/debian-security|http://snapshot.debian.org/archive/debian-security/20261027T000000Z|; \
            s|http://deb.debian.org/debian|http://snapshot.debian.org/archive/debian/20261027T000000Z|' \
        /etc/apt/sources.list.d/debian.sources \
  && apt-get -o Acquire::Check-Valid-Until=false update \
  && apt-get install -y --no-install-recommends openssl=3.0.22-1~deb12u2 libssl3=3.0.22-1~deb12u2

# Install packages, build and keep only prod packages
WORKDIR /app
COPY *.json ./
COPY ./src ./src
COPY ./prisma ./prisma
RUN npm ci --ignore-scripts --no-update-notifier
RUN npm run prisma-generate-complaint-outcome 
RUN npm run prisma-generate-shared
RUN npm run prisma-generate-investigation
RUN npm run prisma-generate-inspection
# node:22-bookworm-slim as of 2026-10-19
FROM node@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392 AS build

# Install packages, build and keep only prod packages
WORKDIR /app
COPY *.json ./
COPY ./src ./src
COPY ./prisma ./prisma
RUN ls -la /app/src/**
RUN npm ci --ignore-scripts --no-update-notifier --omit=dev

# COPY over few dependencies from buildwithdevdeps
COPY --from=buildwithdevdeps /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=buildwithdevdeps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=buildwithdevdeps /app/node_modules/prisma ./node_modules/prisma

RUN npm run build

# Deploy container
# node:22-bookworm-slim as of 2026-10-19
FROM node@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392
ENV NODE_ENV=production

# Prisma requires OpenSSL, which is not included in the slim image
# Pinned via the Debian snapshot archive; keep the date and versions in sync with the build stage above
RUN sed -i 's|http://deb.debian.org/debian-security|http://snapshot.debian.org/archive/debian-security/20261027T000000Z|; \
            s|http://deb.debian.org/debian|http://snapshot.debian.org/archive/debian/20261027T000000Z|' \
        /etc/apt/sources.list.d/debian.sources \
  && apt-get -o Acquire::Check-Valid-Until=false update \
  && apt-get install -y --no-install-recommends openssl=3.0.22-1~deb12u2 libssl3=3.0.22-1~deb12u2 \
     curl=7.88.1-10+deb12u15 libcurl4=7.88.1-10+deb12u15 \
  && rm -rf /var/lib/apt/lists/*

# Copy over app
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Ports, health check and non-root user
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/api || exit 1
USER node

# Start up command with 50MB of heap size, each application needs to determine what is the best value. DONT use default as it is 4GB.
CMD ["--max-old-space-size=500", "/app/dist/src/main"]