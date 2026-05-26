#!/bin/sh
set -e

echo "[entrypoint] Installing dependencies..."
npm install

echo "[entrypoint] Pre-compiling SCSS..."
npx sass --no-source-map --quiet-deps \
  src/assets/sass/app.scss:src/assets/sass/app.compiled.css \
  src/assets/sass/user-management.scss:src/assets/sass/user-management.compiled.css \
  src/assets/sass/hwcr-assessment.scss:src/assets/sass/hwcr-assessment.compiled.css \
  src/assets/sass/hwcr-equipment.scss:src/assets/sass/hwcr-equipment.compiled.css \
  src/assets/sass/investigation-continuation.scss:src/assets/sass/investigation-continuation.compiled.css

echo "[entrypoint] Starting Vite dev server..."
npm run dev
