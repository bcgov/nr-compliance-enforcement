FROM node:19-bullseye AS build

WORKDIR /app
COPY . .
RUN npm ci --omit=dev && \
    npm run build

FROM caddy:2.6.4-alpine AS deploy
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /app/dist

EXPOSE 3000 3001
USER 1001
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:3001/health || exit 1
