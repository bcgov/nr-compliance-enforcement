#!/bin/sh
set -e

SASS_DIR="src/assets/sass"

# Discover SCSS entry files: any .scss file that isn't @imported by another.
imported_files=$(grep -roh '@import "[^"]*"' "$SASS_DIR"/*.scss 2>/dev/null \
  | sed 's/.*@import "//;s/"//' \
  | xargs -I{} basename {} \
  | sort -u)

SASS_PAIRS=""
for f in "$SASS_DIR"/*.scss; do
  base=$(basename "$f")
  if echo "$imported_files" | grep -qx "$base"; then
    continue
  fi
  name="${base%.scss}"
  pair="$SASS_DIR/${name}.scss:$SASS_DIR/${name}.compiled.css"
  SASS_PAIRS="${SASS_PAIRS:+$SASS_PAIRS }$pair"
done

echo "[entrypoint] Installing dependencies..."
npm install

echo "[entrypoint] SCSS entry files:"
for pair in $SASS_PAIRS; do echo "  $pair"; done

echo "[entrypoint] Pre-compiling SCSS..."
# shellcheck disable=SC2086
npx sass --no-source-map --quiet-deps $SASS_PAIRS

echo "[entrypoint] Starting SCSS watcher..."
# shellcheck disable=SC2086
npx sass --watch --poll --no-source-map --quiet-deps $SASS_PAIRS &

echo "[entrypoint] Starting Vite dev server..."
npm run dev
