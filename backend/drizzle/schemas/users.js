import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  uploadSize: integer("upload_size").default(0),
  createdAt: timestamp("created_at"),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  role: text("role").default("user").notNull(),
});
