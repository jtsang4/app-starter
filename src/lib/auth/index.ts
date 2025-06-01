import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import { config } from '@/config';
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

  // Authentication secret - required for encryption and security
  secret: config.BETTER_AUTH_SECRET,

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

  // Use AUTH_SERVER_URL if provided, otherwise use the same domain
  baseURL: process.env.AUTH_SERVER_URL || 'http://localhost:4023',

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
