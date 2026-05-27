#!/bin/sh
set -e

SASS_DIR="src/assets/sass"

# Discover SCSS entry files: any .scss file that isn't @imported by another.
find_entry_files() {
  imported=$(grep -rh '@import' "$SASS_DIR"/*.scss 2>/dev/null \
    | sed -n 's/.*@import ["'\'']\.\///' \
    | sed 's/["'\''].*//' \
    | sort -u)

  for f in "$SASS_DIR"/*.scss; do
    base=$(basename "$f")
    echo "$imported" | grep -qx "$base" && continue
    name="${base%.scss}"
    echo "$SASS_DIR/${name}.scss:$SASS_DIR/${name}.compiled.css"
  done
}

SASS_PAIRS=$(find_entry_files)

echo "[entrypoint] Installing dependencies..."
npm install

echo "[entrypoint] SCSS entry files:"
echo "$SASS_PAIRS" | while read -r pair; do echo "  $pair"; done

echo "[entrypoint] Pre-compiling SCSS..."
# shellcheck disable=SC2086
npx sass --no-source-map --quiet-deps $SASS_PAIRS

echo "[entrypoint] Starting SCSS watcher..."
# shellcheck disable=SC2086
npx sass --watch --poll --no-source-map --quiet-deps $SASS_PAIRS &

echo "[entrypoint] Starting Vite dev server..."
npm run dev
