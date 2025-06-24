import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const calendarEventsTable = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDateTime: timestamp("start_datetime").notNull(),
  endDateTime: timestamp("end_datetime").notNull(),
  eventType: varchar("event_type", { length: 20 }).notNull(),
  color: varchar("color", { length: 7 }),
  notifyMe: integer("notify_before_minutes"),
  recurrence: text("recurrence"),
  seriesId: text("series_id"),
  createdBy: integer("created_by").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  additionalInfo: jsonb("additional_info").default("{}"),
});
