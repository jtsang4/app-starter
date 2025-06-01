#!/bin/sh
set -e

# Function to wait for database to be ready
wait_for_db() {
  echo "⏳ Waiting for database to be ready..."
  attempt=1
  max_attempts=30

  until node -e "
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    pool.connect()
      .then(client => { client.release(); pool.end(); })
      .catch(() => process.exit(1));
  " 2>/dev/null; do
    if [ $attempt -eq $max_attempts ]; then
      echo "❌ Database connection failed after $max_attempts attempts"
      exit 1
    fi
    echo "Database not ready (attempt $attempt/$max_attempts), waiting 2 seconds..."
    sleep 2
    attempt=$((attempt + 1))
  done
  echo "✅ Database is ready"
}

# Always run database initialization (smart migration system)
echo "🚀 Initializing database..."

# Wait for database to be ready first
wait_for_db

# Run intelligent migration system
echo "🔍 Checking database state and running migrations if needed..."
node ./scripts/migrate.js

echo "✅ Database initialization completed"

# Start the application
echo "🚀 Starting application..."
exec "$@"
