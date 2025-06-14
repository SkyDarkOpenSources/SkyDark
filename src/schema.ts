import { pgTable, text } from 'drizzle-orm/pg-core'

export const Users = pgTable('Users', {
  user_id: text('user_id').primaryKey().notNull(),
  email: text('email').notNull(),
})