# Build static files
# Node Bullseye has npm
# node:20.19.0-bullseye-slim as of 2026-09-15
FROM node@sha256:c9063968e5c359c7430892bd48448f8368aa0a76527b816e03bce59fe08bfd93 AS buildwithdevdeps

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
# node:20.19.0-bullseye-slim as of 2026-09-15
FROM node@sha256:c9063968e5c359c7430892bd48448f8368aa0a76527b816e03bce59fe08bfd93 AS build

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
# node:20.19.0-bullseye-slim as of 2026-09-15
FROM node@sha256:c9063968e5c359c7430892bd48448f8368aa0a76527b816e03bce59fe08bfd93
ENV NODE_ENV=production

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