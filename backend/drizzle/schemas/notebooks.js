import { pgTable, text, uuid, timestamp, integer } from 'drizzle-orm/pg-core';
import { usersTable } from './users.js';

export const notebooks = pgTable('notebooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const notebookPages = pgTable('notebook_pages', {
    id: uuid('id').defaultRandom().primaryKey(),
    notebookId: uuid('notebook_id').references(() => notebooks.id).notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });