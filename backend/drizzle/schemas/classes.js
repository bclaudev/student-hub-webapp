import {
    pgTable,
    serial,
    text,
    integer,
    timestamp,
    time,     // import the "time" type
  } from "drizzle-orm/pg-core";
  import { usersTable } from "./users.js";
  
  export const classesTable = pgTable("classes", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    teacherName: text("teacher_name"),
    examDate: timestamp("exam_date"),
    curriculum: text("curriculum"),
    createdBy: integer("created_by").references(() => usersTable.id, { onDelete: "cascade" }),
  
    // The date the class starts (e.g. first Monday of classes)
    startDate: timestamp("start_date"),
  
    // weekly, monthly, etc. 
    recurrence: text("recurrence"),
  
    // Time columns (PG "time" type)
    startTime: time("start_time", { withTimezone: false }).notNull(),
    endTime: time("end_time", { withTimezone: false }).notNull(),
  });