// lib/posthog.js
import { PostHog } from "posthog-node";
import "dotenv/config";

export const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST || "https://app.posthog.com",
});
