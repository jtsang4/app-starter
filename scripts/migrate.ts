import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import 'dotenv/config';

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });

  try {
    // Wait for database
    console.log('⏳ Waiting for database...');
    let attempts = 0;
    while (attempts < 30) {
      try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        break;
      } catch (error) {
        attempts++;
        if (attempts === 30) throw error;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    console.log('✅ Database connected');

    // Run migrations
    const db = drizzle(pool);
    console.log('🚀 Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed');
  } catch (error: any) {
    // Handle "already exists" errors automatically
    if (error.code === '42710') {
      console.log('🔄 Objects already exist, syncing state...');

      const client = await pool.connect();
      try {
        await client.query('CREATE SCHEMA IF NOT EXISTS drizzle');
        await client.query(`
          CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
            id SERIAL PRIMARY KEY,
            hash text NOT NULL,
            created_at bigint
          )
        `);

        // Mark existing migrations as applied
        const fs = require('node:fs');
        if (fs.existsSync('./drizzle')) {
          const files = fs
            .readdirSync('./drizzle')
            .filter((f: string) => f.endsWith('.sql'));

          for (const file of files) {
            const hash = file.replace('.sql', '');
            await client.query(
              `
              INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING
            `,
              [hash, Date.now()],
            );
          }
        }
        console.log('✅ Database state synchronized');
      } finally {
        client.release();
      }
    } else {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

runMigrations();
