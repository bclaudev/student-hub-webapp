// routes/classes.ts
import { Hono } from "hono";
import { db } from "../db.js";
import { classesTable } from "../drizzle/schema.js";
import { z } from "zod";
import { eq } from "drizzle-orm";

const classesRoute = new Hono();

const classSchema = z.object({
  name: z.string(),
  abbreviation: z.string().optional(),
  teacherName: z.string().optional(),
  deliveryMode: z.enum(["campus", "online"]),
  roomNumber: z.string().optional(),
  meetingLink: z.string().optional(),
  day: z.string(),
  startTime: z.string(), // format HH:MM
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
  const userId = ctx.get("userId"); // autentificare necesară
  const body = await ctx.req.json();
  const parsed = classSchema.safeParse(body);

  if (!parsed.success) {
    return ctx.json({ error: parsed.error.flatten() }, 400);
  }

  const newClass = await db.insert(classesTable).values({
    ...parsed.data,
    createdBy: userId,
  });

  return ctx.json({ success: true });
});

classesRoute.delete("/:id", async (ctx) => {
  const userId = ctx.get("userId");
  const classId = Number(ctx.req.param("id"));

  await db
    .delete(classesTable)
    .where(
      and(eq(classesTable.id, classId), eq(classesTable.createdBy, userId))
    );

  return ctx.json({ success: true });
});

classesRoute.put("/:id", async (ctx) => {
  const userId = ctx.get("userId");
  const classId = Number(ctx.req.param("id"));
  const body = await ctx.req.json();
  const parsed = classSchema.safeParse(body);

  if (!parsed.success) {
    return ctx.json({ error: parsed.error.flatten() }, 400);
  }

  await db
    .update(classesTable)
    .set({ ...parsed.data })
    .where(
      and(eq(classesTable.id, classId), eq(classesTable.createdBy, userId))
    );

  return ctx.json({ success: true });
});

export { classesRoute };
