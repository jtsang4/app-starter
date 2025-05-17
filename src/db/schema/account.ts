import { pgTable, timestamp, varchar, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from './user';

/**
 * Account table definition
 * Follows Better Auth schema requirements for storing authentication provider accounts
 */
export const accountsTable = pgTable('account', {
  // Primary identification
  id: uuid().primaryKey().defaultRandom(),

  // Relationship to user
  userId: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  // Provider information
  accountId: varchar({ length: 255 }).notNull(),
  providerId: varchar({ length: 255 }).notNull(),

  // OAuth tokens
  accessToken: varchar({ length: 2048 }),
  refreshToken: varchar({ length: 2048 }),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),

  // Additional OAuth data
  scope: varchar({ length: 255 }),
  idToken: varchar({ length: 2048 }),

  // Password for credential accounts
  password: varchar({ length: 255 }),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
