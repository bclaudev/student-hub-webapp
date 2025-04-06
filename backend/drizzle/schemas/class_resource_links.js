import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { resourcesTable } from "./resources.js";
import { classesTable } from "./classes.js";

export const classResourceLinksTable = pgTable("class_resource_links", {
    id: serial("id").primaryKey(),
    classId: integer("class_id").references(() => classesTable.id, { onDelete: "cascade" }),
    resourceId: integer("resource_id").references(() => resourcesTable.id, { onDelete: "cascade" }),
  });