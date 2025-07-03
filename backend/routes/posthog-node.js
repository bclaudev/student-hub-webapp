// test-posthog.js
import { PostHog } from "posthog-node";
import "dotenv/config";

const posthog = new PostHog("phc_ofXqpXWZ1bqF5NSRc69YMa39POPngswXgKjH0VS9Bpi", {
  host: "https://app.posthog.com",
});

posthog.capture({
  distinctId: "test-123",
  event: "resource_uploaded",
  properties: {
    fileName: "manual-test.pdf",
    fileSize: 1234,
  },
});

await posthog.flush();
