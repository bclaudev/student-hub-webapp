import { PostHog } from "posthog-node";
import "dotenv/config";

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST || "https://app.posthog.com",
  flushAt: 1,
  flushInterval: 0,
  // activăm debug
  debug: true,
});

try {
  await posthog.capture({
    distinctId: "debug-test-user",
    event: "debug_test_event",
    properties: {
      debug: true,
      time: new Date().toISOString(),
    },
  });

  console.log("✅ Event înregistrat local, așteptăm flush...");
  await posthog.flush();
  console.log("🚀 Flush complet. Ar trebui să apară în PostHog.");
} catch (error) {
  console.error("❌ Eroare la capture:", error);
}

await posthog.shutdown();
