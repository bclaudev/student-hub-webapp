// scripts/update-event-info.js

import { db } from "../db.js";
import { calendarEventsTable, classesTable } from "../drizzle/schema.js";
import { and, eq, sql } from "drizzle-orm";

async function enrichCalendarEvents() {
  console.log("🔍 Fetching class-type calendar events...");

  const events = await db
    .select()
    .from(calendarEventsTable)
    .where(eq(calendarEventsTable.eventType, "class"));

  let updatedCount = 0;

  for (const event of events) {
    const classId = parseInt(event.additionalInfo?.classId);
    if (!classId) continue;

    const cls = await db
      .select()
      .from(classesTable)
      .where(eq(classesTable.id, classId))
      .then((res) => res[0]);

    if (!cls) continue;

    const updatedInfo = {
      ...event.additionalInfo,
      abbreviation: cls.abbreviation,
      teacherName: cls.teacherName,
      roomNumber: cls.roomNumber,
      meetingLink: cls.meetingLink,
      class_type: cls.class_type,
      deliveryMode: cls.deliveryMode,
      recurrence: cls.recurrence,
      examDate: cls.examDate,
      curriculum: cls.curriculum,
      color: cls.color || "#a585ff",
    };

    await db
      .update(calendarEventsTable)
      .set({ additionalInfo: updatedInfo })
      .where(eq(calendarEventsTable.id, event.id));

    updatedCount++;
  }

  console.log(`✅ Updated ${updatedCount} class events with full info.`);
}

enrichCalendarEvents()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to update events:", err);
    process.exit(1);
  });
