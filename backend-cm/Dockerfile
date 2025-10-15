# Stage 1: Builder
# This stage installs all dependencies (including dev), generates prisma clients,
# builds the application, and then removes dev dependencies.
FROM node:20.19.0-bullseye-slim AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including dev)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-update-notifier

COPY . .

# Run all Prisma generate commands. This ensures the client is fully built
# before the application build starts.
RUN npm run prisma-generate-complaint-outcome && \
    npm run prisma-generate-shared && \
    npm run prisma-generate-investigation && \
    npm run prisma-generate-inspection

# Build the application
RUN npm run build

# Remove development dependencies to keep the final node_modules folder smaller
RUN npm prune --omit=dev

# Stage 2: Production
FROM node:20.19.0-bullseye-slim

# Set the environment to production
ENV NODE_ENV=production

WORKDIR /app

# Copy the pruned node_modules and the built application from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Copy prisma schema files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/@prisma ./@prisma
COPY --from=builder /app/.prisma ./.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Ports, health check, and non-root user
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/api || exit 1
USER node

CMD ["node", "--max-old-space-size=500", "/app/dist/src/main.js"]