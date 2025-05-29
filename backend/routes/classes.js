// routes/classes.ts
import { Hono } from "hono";
import { db } from "../db.js";
import { classesTable } from "../drizzle/schema.js";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { verifyToken } from "../middleware/authMiddleware.js";
import { calendarEventsTable } from "../drizzle/schema.js";

const classesRoute = new Hono();

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
  examDate: z.string().optional(),
  curriculum: z.string().optional(),
  startDate: z.string(),
});

classesRoute.use("*", verifyToken);
// CREATE class
classesRoute.post("/", async (ctx) => {
  const userId = ctx.get("user").id;
  const body = await ctx.req.json();
  const parsed = classSchema.safeParse(body);

  if (!parsed.success) {
    return ctx.json({ error: parsed.error.flatten() }, 400);
  }

  const payload = {
    ...parsed.data,
    class_type: parsed.data.class_type || "course",
    examDate: parsed.data.examDate ? new Date(parsed.data.examDate) : null,
    startDate: new Date(parsed.data.startDate),
    createdBy: userId,
  };

  const result = await db.insert(classesTable).values(payload).returning();
  return ctx.json(result[0]);
});

// UPDATE class
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
    examDate: parsed.data.examDate ? new Date(parsed.data.examDate) : null,
    startDate: new Date(parsed.data.startDate),
  };

  await db
    .update(classesTable)
    .set(updatedPayload)
    .where(
      and(eq(classesTable.id, classId), eq(classesTable.createdBy, userId))
    );

  const result = await db.insert(classesTable).values(payload).returning();
  const insertedClass = result[0];

  console.log("📅 Creating exam calendar event...");

  if (parsed.data.examDate) {
    console.log("parsed.data.examDate = ", parsed.data.examDate);
    const [startHour, startMin] = parsed.data.startTime.split(":").map(Number);
    const [endHour, endMin] = parsed.data.endTime.split(":").map(Number);

    const start = new Date(parsed.data.examDate);
    start.setHours(startHour, startMin);

    const end = new Date(parsed.data.examDate);
    end.setHours(endHour, endMin);

    await db.insert(calendarEventsTable).values({
      title: `Exam: ${parsed.data.name}`,
      description: `Exam for ${parsed.data.name}`,
      startDateTime: start,
      endDateTime: end,
      eventType: "exam",
      color: parsed.data.color || "#a585ff",
      createdBy: userId,
      additionalInfo: {
        classId: result[0].id,
      },
    });
  }
  console.log("✅ Exam event inserted into calendar_events.");

  return ctx.json(insertedClass);
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
  const classes = await db
    .select()
    .from(classesTable)
    .where(eq(classesTable.createdBy, userId));

  return ctx.json({ classes });
});

classesRoute.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const { color } = await c.req.json();

  console.log("Received PATCH for class ID:", id, "with color:", color);

  try {
    await db.update(classesTable).set({ color }).where(eq(classesTable.id, id)); // <- aici probabil dă eroare

    return c.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/classes/:id failed", error);
    return c.text("Internal server error", 500);
  }
});

export { classesRoute };
