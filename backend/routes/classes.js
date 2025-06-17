import { Hono } from "hono";
import { db } from "../db.js";
import { classesTable, calendarEventsTable } from "../drizzle/schema.js";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { verifyToken } from "../middleware/authMiddleware.js";
import { generateRecurringClassEvents } from "../lib/recurrence/generate-recurring-class-events.js";
import { semestersTable } from "../drizzle/schema.js";

const classesRoute = new Hono();

// 🔧 Schema cu preprocess pentru examDate
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
});

classesRoute.use("*", verifyToken);

// ✅ CREATE class + calendar exam event if applicable
classesRoute.post("/", async (ctx) => {
  const userId = ctx.get("user").id;
  const body = await ctx.req.json();
  const parsed = classSchema.safeParse(body);

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
      title: `{parsed.data.name}`,
      description: `Exam for ${parsed.data.name}`,
      startDateTime: start,
      endDateTime: end,
      eventType: "exam",
      color: parsed.data.color || "#a585ff",
      createdBy: userId,
      additionalInfo: {
        classId: insertedClass.id,
      },
    });
    console.log("✅ Exam calendar event created (POST)");
  }

  //Generate recurring class events
  const semester = await db.query.semestersTable.findFirst({
    where: eq(semestersTable.createdBy, userId),
  });

  if (!semester) {
    console.warn(
      "⚠️ User has no semester configured, skipping class event generation."
    );
    return ctx.json(
      {
        error: "Semester not found for user. Please complete onboarding first.",
      },
      400
    ); // sau 200, dar cu warning
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
    const recurringEvents = generateRecurringClassEvents({
      weekday:
        parsed.data.day.charAt(0).toUpperCase() + parsed.data.day.slice(1),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      recurrence: parsed.data.recurrence, // "weekly" | "biweekly"
      semesterStart: semester.startDate,
      semesterEnd: semester.endDate,
    });

    const calendarEvents = recurringEvents.map(({ start, end }) => ({
      title: parsed.data.name,
      description: `Class: ${parsed.data.name}`,
      startDateTime: start,
      endDateTime: end,
      eventType: "class",
      color: parsed.data.color || "#a585ff",
      createdBy: userId,
      additionalInfo: {
        classId: insertedClass.id,
      },
    }));

    if (calendarEvents.length > 0) {
      await db.insert(calendarEventsTable).values(calendarEvents);
      console.log(`✅ ${calendarEvents.length} class events created`);
    } else {
      console.warn("⚠️ No recurring events generated, skipping insert.");
    }
  }
  return ctx.json(insertedClass);
});

// ✅ UPDATE class (rămâne cu logică de update exam dacă vrei)
classesRoute.put("/:id", async (ctx) => {
  const userId = ctx.get("user").id;
  const classId = Number(ctx.req.param("id"));
  const body = await ctx.req.json();
  const parsed = classSchema.safeParse(body);

  if (!parsed.success) {
    return ctx.json({ error: parsed.error.flatten() }, 400);
  }

  const updatedPayload = {
    ...parsed.data,
  };

  await db
    .update(classesTable)
    .set(updatedPayload)
    .where(
      and(eq(classesTable.id, classId), eq(classesTable.createdBy, userId))
    );

  return ctx.json({ success: true });
});

// ✅ DELETE class
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

// ✅ GET all classes
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

// ✅ PATCH color only
classesRoute.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const { color } = await c.req.json();

  console.log("Received PATCH for class ID:", id, "with color:", color);

  try {
    await db.update(classesTable).set({ color }).where(eq(classesTable.id, id));
    return c.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/classes/:id failed", error);
    return c.text("Internal server error", 500);
  }
});

export { classesRoute };
