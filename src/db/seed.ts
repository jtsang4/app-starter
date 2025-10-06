import { config as loadEnv } from "dotenv";

loadEnv();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const { env } = await import("../env");

import { user } from "./schema";

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

async function runSeeding() {
  console.log("Starting seeding...");
  const firstEmailRaw = (env.ADMIN_EMAILS ?? "admin@appstarter.com").split(
    ",",
  )[0];
  const adminEmail = (firstEmailRaw || "admin@appstarter.com").trim();

  try {
    await waitForDb();
    await db
      .insert(user)
      .values({
        name: "James Tsang",
        email: adminEmail,
        emailVerified: true,
        phoneNumber: "1234567890",
        phoneNumberVerified: true,
      })
      .onConflictDoNothing({ target: user.email });
    console.log("Seeding complete!");
  } finally {
    await pool.end();
  }
}

runSeeding().catch((err) => {
  console.error("Seeding failed:", err);
  process.exitCode = 1;
});
