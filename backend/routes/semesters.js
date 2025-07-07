import { Hono } from "hono";
import { z } from "zod";
import { verifyToken } from "../middleware/authMiddleware.js";
import { db } from "../db.js";
import { semestersTable } from "../drizzle/schema.js";
import { and, eq, lte, gte } from "drizzle-orm";
import { classesTable } from "../drizzle/schema.js";

const semesterSchema = z.object({
  name: z.string().optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid startDate"),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid endDate"),
});

const semestersRoute = new Hono();

semestersRoute.use("*", verifyToken);

semestersRoute.post("/set", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const parsed = semesterSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400);
  }

  const { name, startDate, endDate } = parsed.data;

  // await db.delete(semestersTable).where(eq(semestersTable.createdBy, user.id));

  await db.insert(semestersTable).values({
    createdBy: user.id,
    name: name ?? "Current Semester",
    startDate,
    endDate,
  });

  await posthog.capture({
    distinctId: user.id,
    event: "semester_created",
    properties: {
      name: name ?? "Current Semester",
      startDate,
      endDate,
    },
  });
  await posthog.flush();

  return c.json({ success: true });
});

semestersRoute.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  try {
    await db
      .delete(classesTable)
      .where(eq(classesTable.semesterId, Number(id)));

    // Apoi șterge semestrul
    await db
      .delete(semestersTable)
      .where(
        and(
          eq(semestersTable.id, Number(id)),
          eq(semestersTable.createdBy, user.id)
        )
      );

    await posthog.capture({
      distinctId: user.id,
      event: "semester_deleted",
      properties: {
        semesterId: Number(id),
      },
    });
    await posthog.flush();

    return c.json({ success: true });
  } catch (err) {
    console.error("Delete semester error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

semestersRoute.patch("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();

  const parsed = semesterSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400);
  }

  try {
    const { name, startDate, endDate } = parsed.data;

    const result = await db
      .update(semestersTable)
      .set({ name, startDate, endDate })
      .where(
        and(
          eq(semestersTable.id, Number(id)),
          eq(semestersTable.createdBy, user.id)
        )
      )
      .returning();

    if (result.length === 0) {
      return c.json({ error: "Semester not found or not yours" }, 404);
    }

    await posthog.capture({
      distinctId: user.id,
      event: "semester_updated",
      properties: {
        semesterId: Number(id),
        name,
        startDate,
        endDate,
      },
    });
    await posthog.flush();

    return c.json(result[0]); // trimite înapoi semestrul actualizat
  } catch (err) {
    console.error("PATCH /semesters/:id error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

semestersRoute.get("/", async (c) => {
  try {
    const user = c.get("user");
    console.log("USER in GET:", user);

    if (!user || !user.id) {
      return c.json({ error: "Unauthorized (no user ID)" }, 401);
    }

    const result = await db
      .select()
      .from(semestersTable)
      .where(eq(semestersTable.createdBy, user.id));

    return c.json({ semesters: result });
  } catch (err) {
    console.error("Eroare internă în GET /semesters/get:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

semestersRoute.get("/active", async (c) => {
  const user = c.get("user");

  const today = new Date().toISOString();

  const result = await db
    .select()
    .from(semestersTable)
    .where(
      and(
        eq(semestersTable.createdBy, user.id),
        lte(semestersTable.startDate, today),
        gte(semestersTable.endDate, today)
      )
    );

  const activeSemester = result[0];

  if (!activeSemester) {
    return c.json({ error: "No active semester for today" }, 404);
  }

  return c.json({ activeSemester });
});

export default semestersRoute;
