import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  json,
} from "drizzle-orm/pg-core";

export const annotationsTable = pgTable("annotations", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").notNull(),
  userId: integer("user_id").notNull(),
  data: json("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
