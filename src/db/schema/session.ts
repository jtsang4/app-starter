import { pgTable, timestamp, varchar, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from './user';

/**
 * Session table definition
 * Follows Better Auth schema requirements for storing user sessions
 */
export const sessionsTable = pgTable('session', {
  // Primary identification
  id: uuid().primaryKey().defaultRandom(),

  // Relationship to user
  userId: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  // Session data
  token: varchar({ length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),

  // Device information
  ipAddress: varchar({ length: 45 }),
  userAgent: varchar({ length: 255 }),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
