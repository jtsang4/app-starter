import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const verification = pgTable("verification", {
  id: uuid().primaryKey().defaultRandom(),
  identifier: varchar({ length: 255 }).notNull(),
  value: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
