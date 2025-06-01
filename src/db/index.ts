import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';
import { config } from '@/config';

const databaseUrl = config.DATABASE_URL;

const poolConfig: PoolConfig = {
  connectionString: databaseUrl,
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 60000, // Increased to 60 seconds for cloud databases
  query_timeout: 60000, // Add query timeout for cloud databases
  // Add keepalive settings for better connection stability
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
};

const pool = new Pool(poolConfig);

// Handle pool errors with detailed logging
pool.on(
  'error',
  (err: Error & { code?: string; hostname?: string; port?: number }) => {
    console.error('❌ Unexpected error on idle client:', err);
    console.error('Error details:', {
      code: err.code || 'unknown',
      message: err.message,
      stack: err.stack,
    });
  },
);

// Handle pool connect events for debugging
pool.on('connect', () => {
  console.log('✅ New client connected to database');
});

pool.on('remove', () => {
  console.log('🔌 Client removed from pool');
});

// Test initial connection only in runtime, not during build
const isBuildTime =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.argv.includes('build') ||
  process.env.DATABASE_URL?.includes('build-placeholder');

if (!isBuildTime) {
  pool
    .connect()
    .then((client) => {
      console.log('✅ Database pool initialized successfully');
      client.release();
    })
    .catch((err) => {
      console.error('❌ Failed to initialize database pool:', err);
      console.error('Connection details:', {
        code: err.code,
        message: err.message,
        host: err.hostname || 'unknown',
        port: err.port || 'unknown',
      });
    });
}

export const db = drizzle({ client: pool });
