import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv();

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const { env } = await import("../env");

// Create a pg pool. In production (non-local), enable SSL if needed.
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl:
    env.NODE_ENV === "production" &&
    !env.DATABASE_URL.includes("localhost") &&
    !env.DATABASE_URL.includes("127.0.0.1")
      ? { rejectUnauthorized: false }
      : undefined,
});

const db = drizzle({ client: pool });

async function waitForDb(maxRetries = 10, delayMs = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await pool.query("select 1");
      return;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.warn(
        `DB not ready (attempt ${attempt}/${maxRetries}). Retrying in ${delayMs}ms...`,
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

async function runMigrations() {
  const migrationsFolder =
    env.DRIZZLE_MIGRATIONS_FOLDER || path.resolve(process.cwd(), "drizzle");

  console.log(`Starting migrations from: ${migrationsFolder}`);

  try {
    await waitForDb();
    // Cast to any to avoid type mismatch caused by multiple drizzle-orm instances under pnpm hoisting
    // biome-ignore lint/suspicious/noExplicitAny: Types are compatible at runtime; mismatch only due to duplicate drizzle-orm instances
    await migrate(db as any, { migrationsFolder });
    console.log("Migrations applied successfully.");
  } finally {
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exitCode = 1;
});
