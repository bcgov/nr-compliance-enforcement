FROM node:22-slim AS build AS build

WORKDIR /app
COPY . .
RUN npm ci --omit=dev && \
    npm run build

FROM caddy:2.8.4-alpine AS deploy
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /app/dist
RUN caddy fmt /etc/caddy/Caddyfile
EXPOSE 3000 3001
USER 1001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3001/health || exit 1
