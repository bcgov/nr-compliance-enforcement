# Build
FROM node:22-slim AS build
# Install packages, build and keep only prod packages
USER root
WORKDIR /app
COPY *.json ./
COPY ./src /app/src
RUN npm ci --omit=dev && \
    npm run build

# Deployment container
# Deploy using minimal Distroless image
FROM gcr.io/distroless/nodejs22-debian12:nonroot
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
# max old space the heap size, 250MB 
CMD ["--max-old-space-size=250", "/app/dist/main"]
