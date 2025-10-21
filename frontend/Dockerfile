FROM node:19-bullseye AS build
# Install curl and clean up apt caches to reduce image size
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN npm ci --omit=dev && \
    npm run build

FROM caddy:2.8.4-alpine AS deploy
COPY --from=build /app/dist /app/dist
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 3000 3001
USER 1001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3001/health || exit 1
