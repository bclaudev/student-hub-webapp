import { pgTable, serial, text, integer, timestamp, boolean, varchar, jsonb } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

// Define the schema for the calendar events table
export const calendarEventsTable = pgTable("calendar_events", {
  id: serial("id").primaryKey(), // Primary key, auto-incrementing ID
  title: text("title").notNull(), // Event title, required
  description: text("description"), // Event description, optional
  startDateTime: timestamp("start_datetime").notNull(), // Event start date and time, required
  endDateTime: timestamp("end_datetime").notNull(), // Event end date and time, required
  eventType: varchar("event_type", { length: 20 }).notNull(), // Event type, required, max length 20 characters
  color: varchar("color", { length: 7 }), // Event color, optional, max length 7 characters (e.g., hex color code)
  notifyMe: boolean("notify_me").default(false), // Notification preference, default is false
  recurrence: text("recurrence"), // Recurrence pattern, optional

  // Foreign key reference to the users table, with cascade delete
  createdBy: integer("created_by").references(() => usersTable.id, { onDelete: "cascade" }),

  // Additional information stored as JSON, default is an empty object
  additionalInfo: jsonb("additional_info").default("{}")
});