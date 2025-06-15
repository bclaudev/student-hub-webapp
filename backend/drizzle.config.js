// backend/drizzle.config.js
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

console.log("DATABASE_URL from .env:", process.env.DATABASE_URL);

export default defineConfig({
  out: "./drizzle/migrations",
  schema: ["./drizzle/schema.js", "./drizzle/schemas/*.js"],
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  dialect: "postgresql",
});
