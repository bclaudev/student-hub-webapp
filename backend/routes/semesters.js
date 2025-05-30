import { Hono } from "hono";
import { z } from "zod";
import { verifyToken } from "../middleware/authMiddleware.js";
import { db } from "../db.js";
import { semestersTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

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

  await db.delete(semestersTable).where(eq(semestersTable.createdBy, user.id));

  await db.insert(semestersTable).values({
    createdBy: user.id,
    name: name ?? "Current Semester",
    startDate,
    endDate,
  });

  return c.json({ success: true });
});

semestersRoute.get("/get", async (c) => {
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

    return c.json(result[0] ?? {});
  } catch (err) {
    console.error("Eroare internă în GET /semesters/get:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default semestersRoute;
