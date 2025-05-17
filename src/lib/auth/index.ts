import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import {
  usersTable,
  sessionsTable,
  accountsTable,
  verificationsTable,
} from '@/db/schema';

/**
 * Better Auth configuration
 * Using Drizzle adapter with custom schema mapping
 */
export const auth = betterAuth({
  // Database configuration with Drizzle adapter
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: usersTable,
      session: sessionsTable,
      account: accountsTable,
      verification: verificationsTable,
    },
  }),

  // Enable email and password authentication
  emailAndPassword: {
    enabled: true,
    // Don't require email verification for login (for demo purposes)
    requireEmailVerification: false,
    // Automatically sign in after registration
    autoSignIn: true,
    // Minimum password length
    minPasswordLength: 8,
  },

  // Session configuration
  session: {
    // Session expires in 7 days
    expiresIn: 7 * 24 * 60 * 60,
  },

  // Base URL for auth endpoints
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4023',

  // Advanced configuration
  advanced: {
    database: {
      // Disable Better Auth's ID generation and let the database handle it
      generateId: false,
      // Use number IDs if your database uses auto-incrementing IDs
      // In this case, we're using UUID so this should be false
      useNumberId: false,
    },
  },
});
