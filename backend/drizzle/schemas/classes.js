import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  time,
  customType,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { semestersTable } from "./semesters.js";

export const classesTable = pgTable("classes", {
  id: serial("id").primaryKey(),

  class_type: text("class_type").notNull(),

  name: text("name").notNull().default("Class Name"),
  abbreviation: text("abbreviation"),
  teacherName: text("teacher_name").notNull(),
  deliveryMode: text("delivery_mode").notNull(),
  roomNumber: text("room_number"),
  meetingLink: text("meeting_link"),
  day: text("day").notNull(),
  startTime: time("start_time", { withTimezone: false }).notNull(),
  endTime: time("end_time", { withTimezone: false }).notNull(),
  recurrence: text("recurrence").notNull(),
  examDate: timestamp("exam_date"),
  curriculum: text("curriculum"),
  startDate: timestamp("start_date").notNull(),
  color: varchar("color", { length: 16 }).default("#a585ff"),
  semesterId: integer("semester_id")
    .references(() => semestersTable.id)
    .notNull(),

  createdBy: integer("created_by").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
});
