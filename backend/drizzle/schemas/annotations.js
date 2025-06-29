import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  json,
  unique,
} from "drizzle-orm/pg-core";
import { resourcesTable } from "./resources.js";
import { usersTable } from "./users.js";

export const annotationsTable = pgTable(
  "annotations",
  {
    id: serial("id").primaryKey(),
    fileId: integer("file_id")
      .notNull()
      .references(() => resourcesTable.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    data: json("data").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueFileUser: unique().on(table.fileId, table.userId),
  })
);
