import { pgTable, text, uuid, timestamp, integer } from 'drizzle-orm/pg-core';
import { usersTable } from './users.js';

export const flashcardSets = pgTable('flashcard_sets', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id').references(() => usersTable.id, { onDelete: "cascade" }),
    title: text('title').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });
  
  export const flashcards = pgTable('flashcards', {
    id: uuid('id').defaultRandom().primaryKey(),
    setId: uuid('set_id').references(() => flashcardSets.id).notNull(),
    front: text('front').notNull(),
    back: text('back').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });