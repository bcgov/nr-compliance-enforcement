# node:22-bookworm as of 2026-09-15
FROM node@sha256:8a34c4ab3ea2c5cd194f07e317b2a8f09461d3c8b05c4e34c8ccd56d56024c4d AS build
WORKDIR /app
COPY . .
RUN npm ci --omit=dev && \
    npm run build

# caddy:2.8.4-alpine as of 2026-09-15
FROM caddy@sha256:af32e97399febea808609119bb21544d0265c58a02836576e32a2d082c262c17 AS deploy
RUN apk add --no-cache curl
COPY --from=build /app/dist /app/dist
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 3000 3001
USER 1001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3001/health || exit 1
