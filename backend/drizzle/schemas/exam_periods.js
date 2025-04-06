import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { classesTable } from "./classes.js";

export const examPeriodsTable = pgTable("exam_periods", {
    id: serial("id").primaryKey(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(), 
    classId: integer("class_id").references(() => classesTable.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }) 
  });