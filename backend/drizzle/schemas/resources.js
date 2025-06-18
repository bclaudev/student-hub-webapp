import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { resourceGroupsTable } from "./resource_groups.js";

export const resourcesTable = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  isPinned: boolean("is_pinned").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  uploadedBy: integer("uploaded_by").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  groupId: integer("group_id").references(() => resourceGroupsTable.id),
  author: text("author"),
});
