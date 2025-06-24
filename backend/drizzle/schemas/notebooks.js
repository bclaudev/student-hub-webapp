import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./users.js";

export const notebooks = pgTable("notebooks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
});

export const notebooksRelations = relations(notebooks, ({ many }) => ({
  pages: many(notebookPages),
}));

export const notebookPages = pgTable("notebook_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  notebookId: uuid("notebook_id")
    .references(() => notebooks.id)
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notebookPagesRelations = relations(notebookPages, ({ one }) => ({
  notebook: one(notebooks, {
    fields: [notebookPages.notebookId],
    references: [notebooks.id],
  }),
}));
