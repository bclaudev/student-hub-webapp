// routes/classes.ts
import { Hono } from "hono";
import { db } from "../db.js";
import { classesTable } from "../drizzle/schema.js";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { verifyToken } from "../middleware/authMiddleware.js";

const classesRoute = new Hono();

classesRoute.use("*", verifyToken);

const classSchema = z.object({
  name: z.string(),
  abbreviation: z.string().optional(),
  teacherName: z.string().optional(),
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

  seminarInstructor: z.string().optional(),
  seminarDeliveryMode: z.string().optional(),
  seminarRoom: z.string().optional(),
  seminarLink: z.string().optional(),
  seminarDay: z.string().optional(),
  seminarTime: z.string().optional(),
  seminarFrequency: z.string().optional(),
  testDate: z.string().optional(),
});

classesRoute.post("/", async (ctx) => {
  const userId = ctx.get("user").id;

  const body = await ctx.req.json();
  const parsed = classSchema.safeParse(body);

  if (!parsed.success) {
    return ctx.json({ error: parsed.error.flatten() }, 400);
  }

  const payload = {
    ...parsed.data,
    examDate: parsed.data.examDate ? new Date(parsed.data.examDate) : null,
    testDate: parsed.data.testDate ? new Date(parsed.data.testDate) : null,
    startDate: new Date(parsed.data.startDate),
    createdBy: userId,
  };

  const {
    seminarTime,
    seminarEndTime,
    seminarDay,
    seminarInstructor,
    seminarDeliveryMode,
    seminarRoom,
    seminarLink,
    seminarFrequency,
    testDate,
    ...courseFields
  } = payload;

  // curs
  await db.insert(classesTable).values({
    ...courseFields,
    createdBy: userId,
  });

  // seminar (doar dacă există date)
  if (seminarTime && seminarEndTime && seminarDay) {
    await db.insert(classesTable).values({
      ...courseFields,
      name: courseFields.name, // același nume
      startTime: seminarTime,
      endTime: seminarEndTime,
      day: seminarDay,
      teacherName: seminarInstructor,
      deliveryMode: seminarDeliveryMode,
      roomNumber: seminarRoom,
      meetingLink: seminarLink,
      recurrence: seminarFrequency,
      examDate: testDate,
      createdBy: userId,
    });
  }

  return ctx.json({ success: true });
});

classesRoute.delete(":id", async (ctx) => {
  const userId = ctx.get("user").id;
  const classId = Number(ctx.req.param("id"));

  await db
    .delete(classesTable)
    .where(
      and(eq(classesTable.id, classId), eq(classesTable.createdBy, userId))
    );

  return ctx.json({ success: true });
});

classesRoute.put(":id", async (ctx) => {
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
    testDate: parsed.data.testDate ? new Date(parsed.data.testDate) : null,
    startDate: new Date(parsed.data.startDate),
  };

  await db
    .update(classesTable)
    .set(updatedPayload)
    .where(
      and(eq(classesTable.id, classId), eq(classesTable.createdBy, userId))
    );

  return ctx.json({ success: true });
});

classesRoute.get("/", async (ctx) => {
  const userId = ctx.get("user").id;

  const classes = await db
    .select()
    .from(classesTable)
    .where(eq(classesTable.createdBy, userId));

  return ctx.json({ classes });
});

export { classesRoute };
