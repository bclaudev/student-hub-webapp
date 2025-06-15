import { Hono } from "hono";
import { verifyToken } from "../middleware/authMiddleware.js";
import { db } from "../db.js";
import { annotationsTable } from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";

const annotationsRoute = new Hono();
annotationsRoute.use("*", verifyToken);

/*──────────────────────────── POST /api/annotations ───────────────────────────*/
annotationsRoute.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  // Acceptă atât „annotations”, cât și „payload” ca fallback
  const { fileId, annotations = body.payload } = body;

  if (typeof fileId !== "number" || typeof annotations !== "object") {
    return c.json({ error: "Invalid request" }, 400);
  }

  /* — UPSERT: păstrează un singur snapshot per (fileId, userId) — */
  await db
    .insert(annotationsTable)
    .values({
      fileId,
      userId: user.id,
      data: annotations,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [annotationsTable.fileId, annotationsTable.userId],
      set: {
        data: annotations,
        updatedAt: new Date(),
      },
    });

  return c.json({ success: true });
});

/*──────────────────────────── GET /api/annotations/:fileId ────────────────────*/
annotationsRoute.get("/:fileId", async (c) => {
  try {
    const user = c.get("user");
    const fileId = Number(c.req.param("fileId"));
    if (isNaN(fileId)) return c.json({ error: "Invalid file ID" }, 400);

    // Extrage snapshot-ul unic pentru (fileId, userId)
    const [row] = await db
      .select({ data: annotationsTable.data })
      .from(annotationsTable)
      .where(
        and(
          eq(annotationsTable.fileId, fileId),
          eq(annotationsTable.userId, user.id)
        )
      )
      .limit(1);

    /* Dacă nu există încă adnotări, întoarce structura goală */
    if (!row) {
      return c.json({ annotations: [], comments: [] });
    }

    return c.json(row.data); // Instant-JSON complet (annotations + comments)
  } catch (err) {
    console.error("❌ Eroare în GET /annotations/:fileId:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default annotationsRoute;
