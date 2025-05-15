// backend/drizzle.config.js
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

console.log("DATABASE_URL from .env:", process.env.DATABASE_URL);

export default defineConfig({
  schema: "./drizzle/schema.js",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
