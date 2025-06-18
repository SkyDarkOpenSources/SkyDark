import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const Users = pgTable('Users', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

export const Employees = pgTable('Employees', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

