# node:22-bookworm-slim as of 2026-10-19
FROM node@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392 AS build
WORKDIR /app
COPY . .
RUN npm ci --omit=dev && \
    npm run build

# caddy:2.8.4-alpine as of 2026-09-15
FROM caddy@sha256:af32e97399febea808609119bb21544d0265c58a02836576e32a2d082c262c17 AS deploy
# Alpine keeps only the latest build, so bump this pin when the base image digest changes
RUN apk add --no-cache curl=8.14.1-r2 libcurl=8.14.1-r2
COPY --from=build /app/dist /app/dist
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 3000 3001
USER 1001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3001/health || exit 1
