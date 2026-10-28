# Build
# node:22-bookworm-slim as of 2026-10-19
FROM node@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392 AS build
# Install packages, build and keep only prod packages
USER root
WORKDIR /app
COPY *.json ./
COPY ./src /app/src
RUN npm ci --omit=dev && \
    npm run build

# Deployment container
# node:22-bookworm-slim as of 2026-10-19
FROM node@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392
# Set node to production
ENV NODE_ENV=production
# curl for the health check and for network debugging in live pods
# Pinned via the Debian snapshot archive so the version can't disappear from the mirror; keep in sync with backend-cm
RUN sed -i 's|http://deb.debian.org/debian-security|http://snapshot.debian.org/archive/debian-security/20261027T000000Z|; \
            s|http://deb.debian.org/debian|http://snapshot.debian.org/archive/debian/20261027T000000Z|' \
        /etc/apt/sources.list.d/debian.sources \
  && apt-get -o Acquire::Check-Valid-Until=false update \
  && apt-get install -y --no-install-recommends curl=7.88.1-10+deb12u15 libcurl4=7.88.1-10+deb12u15 \
  && rm -rf /var/lib/apt/lists/*

# Copy over app
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY ../templates /app/templates

# Port and health check
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/api || exit 1

# Non-privileged user
USER app

# Explicit entrypoint for image
ENTRYPOINT [ "node" ]
# max old space the heap size, 500MB 
CMD ["--max-old-space-size=500", "/app/dist/main"]
