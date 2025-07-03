// scripts/backfill-calendar-events.js
import { db } from "../db.js";
import { classesTable, calendarEventsTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

const run = async () => {
  const events = await db
    .select()
    .from(calendarEventsTable)
    .where(eq(calendarEventsTable.eventType, "class"));

  console.log(`Found ${events.length} class events`);

  let updated = 0;

  for (const event of events) {
    const classId = event.additionalInfo?.classId;
    if (!classId) continue;

    const classData = await db.query.classesTable.findFirst({
      where: eq(classesTable.id, classId),
    });
    if (!classData) continue;

    const cleanExamDate = classData.exam_date
      ? new Date(classData.exam_date)
      : null;

    await db
      .update(calendarEventsTable)
      .set({
        additionalInfo: {
          ...event.additionalInfo,
          name: classData.name, // 🟣 adăugat
          abbreviation: classData.abbreviation,
          teacherName: classData.teacherName,
          roomNumber: classData.roomNumber,
          meetingLink: classData.meetingLink,
          class_type: classData.class_type,
          deliveryMode: classData.deliveryMode,
          recurrence: classData.recurrence,
          examDate:
            classData.exam_date && !isNaN(new Date(classData.exam_date))
              ? new Date(classData.exam_date).toISOString()
              : null,
          curriculum: classData.curriculum,
          color: classData.color,
        },
      })
      .where(eq(calendarEventsTable.id, event.id));

    updated++;
  }

  console.log(`Updated ${updated} calendar class events.`);
  process.exit(0);
};

run().catch((err) => {
  console.error("Failed to run script:", err);
  process.exit(1);
});
