#!/bin/sh
set -e

echo "[Entrypoint] Running DB migrations..."
node /app/dist/db/migrate.js

if [ "$SEED_ON_START" = "true" ]; then
  echo "[Entrypoint] Running DB seed..."
  node /app/dist/db/seed.js
fi

echo "[Entrypoint] Starting server..."
exec node .output/server/index.mjs

