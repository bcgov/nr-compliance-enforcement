# Build static files
# Node Bookwork has npm
# node:22-bookworm-slim as of 2026-10-19
FROM node@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392 AS buildwithdevdeps

# Prisma requires OpenSSL, which is not included in the slim image
# Pinned for consistent builds; bump when Debian removes this version from the mirrors
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl=3.0.22-1~deb12u2 libssl3=3.0.22-1~deb12u2 \
  && rm -rf /var/lib/apt/lists/*

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
# Pinned for consistent builds; bump when Debian removes this version from the mirrors
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl=3.0.22-1~deb12u2 libssl3=3.0.22-1~deb12u2 \
  && rm -rf /var/lib/apt/lists/*

# Copy over app
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Ports, health check and non-root user
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3000/api || exit 1
USER node

# Start up command with 50MB of heap size, each application needs to determine what is the best value. DONT use default as it is 4GB.
CMD ["--max-old-space-size=500", "/app/dist/src/main"]