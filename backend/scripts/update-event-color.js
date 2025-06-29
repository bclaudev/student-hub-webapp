// scripts/update-event-color.js

import { db } from "../db.js";
import { calendarEventsTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

async function syncColorFromAdditionalInfo() {
  const events = await db
    .select()
    .from(calendarEventsTable)
    .where(calendarEventsTable.eventType === "class");

  let updated = 0;

  for (const event of events) {
    const infoColor = event.additionalInfo?.color;

    if (infoColor && event.color !== infoColor) {
      await db
        .update(calendarEventsTable)
        .set({ color: infoColor })
        .where(eq(calendarEventsTable.id, event.id));
      updated++;
    }
  }

  console.log(`🎨 Updated ${updated} events with color from additionalInfo`);
}

syncColorFromAdditionalInfo()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to sync colors:", err);
    process.exit(1);
  });
