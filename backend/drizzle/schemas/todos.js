import { pgTable, text, uuid, timestamp, integer } from 'drizzle-orm/pg-core';
import { usersTable } from './users.js';

export const todoLists = pgTable('todo_lists', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id').references(() => usersTable.id, { onDelete: "cascade" }),
    title: text('title').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });
  
  export const todoItems = pgTable('todo_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    listId: uuid('list_id').references(() => todoLists.id).notNull(),
    content: text('content').notNull(),
    isCompleted: text('is_completed').notNull().default('false'),
    dueDate: timestamp('due_date'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });
  