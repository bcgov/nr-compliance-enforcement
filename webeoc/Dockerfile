# Build
FROM node:22-slim AS build
# Install packages, build and keep only prod packages
USER root
WORKDIR /app
COPY *.json ./
COPY ./src /app/src

RUN npm ci --omit=dev --ignore-scripts && \
    npm run build

# Deployment container
# Deploy using minimal Distroless image
FROM gcr.io/distroless/nodejs22-debian12:nonroot
# Set node to production
ENV NODE_EN=production



# Copy over app
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Port and health check
EXPOSE 3002
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3002/health

# Non-privileged user
USER app

# max old space the heap size, 80MB with 150MB limit in deployment.
CMD ["--max-old-space-size=80", "/app/dist/main"]
