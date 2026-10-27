# Build
# node:22-bookworm-slim as of 2026-10-19
FROM node@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392 AS build
# Install packages, build and keep only prod packages
USER root
WORKDIR /app
COPY *.json ./
COPY ./src /app/src

RUN npm ci --omit=dev --ignore-scripts && \
  npm run build

# Deployment container
# node:22-bookworm-slim as of 2026-10-19
FROM node@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392
# Set node to production
ENV NODE_ENV=production
RUN apt-get --no-install-recommends update && apt-get --no-install-recommends install -y \
  curl vim \
  && rm -rf /var/lib/apt/lists/*
# Copy over app
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Port and health check
EXPOSE 3006
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3006/health

# Non-privileged user
USER app

# max old space the heap size, 80MB with 150MB limit in deployment.
CMD ["--max-old-space-size=80", "/app/dist/main"]

