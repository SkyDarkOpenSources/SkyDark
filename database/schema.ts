// database/schema.ts
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const clubs = pgTable('clubs', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  members:integer('members'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// Export the schema type
export type User = typeof users.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type Club = typeof clubs.$inferSelect;