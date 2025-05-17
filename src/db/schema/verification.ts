import { pgTable, timestamp, varchar, uuid } from 'drizzle-orm/pg-core';

/**
 * Verification table definition
 * Follows Better Auth schema requirements for storing verification tokens
 */
export const verificationsTable = pgTable('verification', {
  // Primary identification
  id: uuid().primaryKey().defaultRandom(),

  // Verification data
  identifier: varchar({ length: 255 }).notNull(),
  value: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
