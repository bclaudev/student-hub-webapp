import { usersTable } from "./users.js";
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const resourceGroupsTable = pgTable("resource_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isGlobal: boolean("is_global").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
});
