import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const notesTable = pgTable("notes", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    uploadedAt: timestamp("uploaded_at").defaultNow(),
    createdBy: integer("created_by").references(() => usersTable.id, { onDelete: "cascade" }),
  });