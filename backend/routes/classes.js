import { Hono } from "hono";
import { db } from "../db.js";
import { classesTable, calendarEventsTable } from "../drizzle/schema.js";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { verifyToken } from "../middleware/authMiddleware.js";

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
      title: `Exam: ${parsed.data.name}`,
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
  const classes = await db
    .select()
    .from(classesTable)
    .where(eq(classesTable.createdBy, userId));

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
