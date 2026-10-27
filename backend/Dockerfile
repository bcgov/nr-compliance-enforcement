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

# Copy over app
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY ../templates /app/templates

# Port and health check
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3000

# Non-privileged user
USER app

# Explicit entrypoint for image
ENTRYPOINT [ "node" ]
# max old space the heap size, 500MB 
CMD ["--max-old-space-size=500", "/app/dist/main"]
