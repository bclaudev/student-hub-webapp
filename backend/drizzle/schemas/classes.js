import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  time, // import the "time" type
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const classesTable = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  abbreviation: text("abbreviation"),
  teacherName: text("teacher_name"),
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

  // Seminar fields (toate opționale)
  seminarInstructor: text("seminar_instructor"),
  seminarDeliveryMode: text("seminar_delivery_mode"),
  seminarRoom: text("seminar_room"),
  seminarLink: text("seminar_link"),
  seminarDay: text("seminar_day"),
  seminarTime: time("seminar_time"),
  seminarFrequency: text("seminar_frequency"),
  testDate: timestamp("test_date"),

  createdBy: integer("created_by").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
});
