import {
  boolean,
  json,
  pgTable,
  timestamp,
  varchar,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * User preferences type definition
 */
export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
};

/**
 * API key storage type definition
 */
export type ApiKeyStorage = {
  provider: string;
  key: string;
  lastTested?: string;
};

/**
 * User table definition
 * Follows Better Auth schema requirements while preserving existing functionality
 */
export const usersTable = pgTable('user', {
  // Primary identification - using UUID for Better Auth compatibility
  id: uuid().primaryKey().defaultRandom(),

  // Basic profile information required by Better Auth
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  image: varchar({ length: 1024 }),

  // Additional fields from original schema
  avatarUrl: varchar({ length: 1024 }),

  // User preferences (stored as JSON)
  preferences: json('preferences')
    .$type<UserPreferences>()
    .default({ theme: 'system' }),

  // Account metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
  isActive: boolean('is_active').default(true),
});
