import { pgTable, serial, text, date, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const semestersTable = pgTable("semesters", {
  id: serial("id").primaryKey(),
  createdBy: integer("created_by").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  name: text("name").default("Semestru curent"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
});
