import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";
import { resourcesTable } from "./resources.js";
import { resourceGroupsTable } from "./resource_groups.js";

export const resourceToGroupTable = pgTable(
  "resource_to_group",
  {
    resourceId: integer("resource_id")
      .references(() => resourcesTable.id, { onDelete: "cascade" })
      .notNull(),
    groupId: integer("group_id")
      .references(() => resourceGroupsTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    // împiedică duplicatele la nivel de pereche
    pk: primaryKey(table.resourceId, table.groupId),
  })
);
