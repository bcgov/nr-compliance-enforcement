#!/bin/sh
set -e

SASS_DIR="src/assets/sass"
SRC_DIR="src"

# Import and compile all scss
imported_scss=$(grep -rhoE 'assets/sass/[A-Za-z0-9_-]+\.scss' "$SRC_DIR" 2>/dev/null \
  | sed 's#.*/##' \
  | sort -u)

SASS_PAIRS=""
for base in $imported_scss; do
  if [ ! -f "$SASS_DIR/$base" ]; then
    echo "[entrypoint] WARNING: $base imported by a component but missing from $SASS_DIR"
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
