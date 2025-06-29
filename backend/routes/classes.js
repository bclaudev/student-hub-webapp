import { Hono } from "hono";
import { db } from "../db.js";
import { classesTable, calendarEventsTable } from "../drizzle/schema.js";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { verifyToken } from "../middleware/authMiddleware.js";
import { generateRecurringClassEvents } from "../lib/recurrence/generate-recurring-class-events.js";
import { semestersTable } from "../drizzle/schema.js";
import { randomUUID } from "crypto";
import { posthog } from "../lib/posthog.js";

const classesRoute = new Hono();

// Schema cu preprocess pentru examDate
const classSchema = z.object({
  class_type: z.enum(["course", "seminar", "colloquy"]),
  name: z.string().min(1),
  abbreviation: z.string().optional(),
  teacherName: z.string().min(1),
  deliveryMode: z.enum(["Campus", "Online"]),
  roomNumber: z.string().optional(),
  meetingLink: z.string().optional(),
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  recurrence: z.string(),
  examDate: z.preprocess((val) => {
    if (typeof val === "string") return new Date(val);
    if (val instanceof Date) return val;
  }, z.date().optional()),
  curriculum: z.string().optional(),
  startDate: z.preprocess((val) => new Date(val), z.date()),
  semesterId: z.number(),
  color: z.string().optional(),
});

classesRoute.use("*", verifyToken);

// CREATE class + calendar exam event if applicable
classesRoute.post("/", async (ctx) => {
  const userId = ctx.get("user").id;
  const body = await ctx.req.json();
  const parsed = classSchema.safeParse(body);
  const seriesId = randomUUID();

  if (!parsed.success) {
    return ctx.json({ error: parsed.error.flatten() }, 400);
  }

  const payload = {
    ...parsed.data,
    createdBy: userId,
    semesterId: parsed.data.semesterId,
  };

  const result = await db.insert(classesTable).values(payload).returning();
  const insertedClass = result[0];

  if (parsed.data.examDate) {
    const [startHour, startMin] = parsed.data.startTime.split(":").map(Number);
    const [endHour, endMin] = parsed.data.endTime.split(":").map(Number);

    const start = new Date(parsed.data.examDate);
    start.setHours(startHour, startMin);

    const end = new Date(parsed.data.examDate);
    end.setHours(endHour, endMin);

    await db.insert(calendarEventsTable).values({
      title: `Exam for ${parsed.data.name}`,
      description: `Exam for ${parsed.data.name}`,
      startDateTime: start,
      endDateTime: end,
      eventType: "exam",
      color: parsed.data.color || "#a585ff",
      createdBy: userId,
      seriesId,
      additionalInfo: {
        classId: insertedClass.id,
      },
    });
    console.log("Exam calendar event created (POST)");

    posthog.capture({
      distinctId: userId,
      event: "calendar_event_created",
      properties: {
        type: "exam",
        source: "timetable_auto",
        recurring: false,
        title: `Exam for ${parsed.data.name}`,
      },
    });
  }

  //Generate recurring class events
  const semester = await db.query.semestersTable.findFirst({
    where: eq(semestersTable.id, parsed.data.semesterId),
  });

  if (!semester) {
    console.warn(
      "User has no semester configured, skipping class event generation."
    );
    return ctx.json(
      {
        error: "Semester not found for user. Please complete onboarding first.",
      },
      400
    );
  }
  console.log("📦 Generating recurring events with:", {
    weekday: parsed.data.day,
    startTime: parsed.data.startTime,
    endTime: parsed.data.endTime,
    recurrence: parsed.data.recurrence,
    semesterStart: semester.startDate,
    semesterEnd: semester.endDate,
  });
  if (semester) {
    const needsCustomStart = parsed.data.recurrence !== "once-a-week";
    const recurringEvents = generateRecurringClassEvents({
      weekday:
        parsed.data.day.charAt(0).toUpperCase() + parsed.data.day.slice(1),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      recurrence: parsed.data.recurrence,
      semesterStart: semester.startDate,
      semesterEnd: semester.endDate,
      startDate: needsCustomStart ? parsed.data.startDate : undefined,
    });

    const calendarEvents = recurringEvents.map(({ start, end }) => ({
      title: parsed.data.name,
      description: `Class: ${parsed.data.name}`,
      startDateTime: start,
      endDateTime: end,
      eventType: "class",
      color: parsed.data.color || "#a585ff",
      createdBy: userId,
      seriesId,
      additionalInfo: {
        classId: insertedClass.id,
        abbreviation: parsed.data.abbreviation,
        teacherName: parsed.data.teacherName,
        roomNumber: parsed.data.roomNumber,
        meetingLink: parsed.data.meetingLink,
        class_type: parsed.data.class_type,
        deliveryMode: parsed.data.deliveryMode,
        recurrence: parsed.data.recurrence,
        examDate: parsed.data.examDate,
        curriculum: parsed.data.curriculum,
        color: parsed.data.color || "#a585ff",
      },
    }));

    if (calendarEvents.length > 0) {
      const insertedEvents = await db
        .insert(calendarEventsTable)
        .values(calendarEvents)
        .returning();
      console.log(` ${calendarEvents.length} class events created`);
      insertedEvents.forEach((ev) => {
        posthog.capture({
          distinctId: userId,
          event: "calendar_event_created",
          properties: {
            type: "class",
            source: "timetable_auto",
            recurring: true,
            eventId: ev.id,
            title: ev.title,
          },
        });
      });

      await posthog.flush();
    } else {
      console.warn("No recurring events generated, skipping insert.");
    }
  }
  return ctx.json(insertedClass);
});

// UPDATE class
// UPDATE class + regenerate calendar events
classesRoute.put("/:id", async (ctx) => {
  try {
    const userId = ctx.get("user").id;
    const classId = Number(ctx.req.param("id"));
    const body = await ctx.req.json();
    const parsed = classSchema.safeParse(body);

    if (!parsed.success) {
      return ctx.json({ error: parsed.error.flatten() }, 400);
    }

    // Update class
    await db
      .update(classesTable)
      .set(parsed.data)
      .where(
        and(eq(classesTable.id, classId), eq(classesTable.createdBy, userId))
      );

    // Delete old recurring events for this class
    await db
      .delete(calendarEventsTable)
      .where(
        and(
          eq(calendarEventsTable.createdBy, userId),
          eq(calendarEventsTable.eventType, "class"),
          sql`(calendar_events.additional_info->>'classId')::int = ${classId}`
        )
      );

    // Regenerate recurring events
    const semester = await db.query.semestersTable.findFirst({
      where: eq(semestersTable.createdBy, userId),
    });

    if (!semester) {
      return ctx.json({ error: "Semester not found for user" }, 400);
    }

    const recurrenceMap = {
      "once-a-week": 7,
      "once-every-two-weeks": 14,
      "once-every-three-weeks": 21,
      "once-a-month": 28,
    };

    const recurringEvents = generateRecurringClassEvents({
      weekday:
        parsed.data.day.charAt(0).toUpperCase() + parsed.data.day.slice(1),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      recurrence: recurrenceMap[parsed.data.recurrence],
      semesterStart: semester.startDate,
      semesterEnd: semester.endDate,
      startDate: parsed.data.startDate,
    });

    const seriesId = randomUUID();

    const calendarEvents = recurringEvents.map(({ start, end }) => ({
      title: parsed.data.name,
      description: `Class: ${parsed.data.name}`,
      startDateTime: start,
      endDateTime: end,
      eventType: "class",
      color: parsed.data.color || "#a585ff",
      createdBy: userId,
      seriesId,
      additionalInfo: {
        classId: insertedClass.id,
        abbreviation: parsed.data.abbreviation,
        teacherName: parsed.data.teacherName,
        roomNumber: parsed.data.roomNumber,
        meetingLink: parsed.data.meetingLink,
        class_type: parsed.data.class_type,
        deliveryMode: parsed.data.deliveryMode,
        recurrence: parsed.data.recurrence,
        examDate: parsed.data.examDate,
        curriculum: parsed.data.curriculum,
        color: parsed.data.color || "#a585ff",
      },
    }));

    if (calendarEvents.length > 0) {
      await db.insert(calendarEventsTable).values(calendarEvents);
      console.log(`🔁 ${calendarEvents.length} recurring events updated`);
    }

    return ctx.json({ success: true });
  } catch (error) {
    console.error("/PUT /classes/:id failed:", error);
    return ctx.json(
      { error: "Internal Server Error", details: String(error) },
      500
    );
  }
});

// DELETE class
classesRoute.delete("/:id", async (ctx) => {
  const userId = ctx.get("user").id;
  const classId = Number(ctx.req.param("id"));

  await db
    .delete(classesTable)
    .where(
      and(eq(classesTable.id, classId), eq(classesTable.createdBy, userId))
    );

  return ctx.json({ success: true });
});

// GET all classes
classesRoute.get("/", async (ctx) => {
  const userId = ctx.get("user").id;

  const semesterIdParam = ctx.req.query("semesterId");

  if (!semesterIdParam) {
    return ctx.json({ error: "Missing semesterId query parameter" }, 400);
  }

  const semesterId = Number(semesterIdParam);

  const classes = await db
    .select()
    .from(classesTable)
    .where(
      and(
        eq(classesTable.createdBy, userId),
        eq(classesTable.semesterId, semesterId)
      )
    );

  return ctx.json({ classes });
});

// PATCH color only
classesRoute.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const { color } = await c.req.json();

  try {
    await db.update(classesTable).set({ color }).where(eq(classesTable.id, id));
    return c.json({ success: true });
  } catch (error) {
    console.error("❌ Failed to patch color:", error);
    return c.json(
      { error: "Internal Server Error", details: String(error) },
      500
    );
  }
});

export { classesRoute };
