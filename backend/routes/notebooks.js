import { Hono } from "hono";
import { notebooks } from "../drizzle/schema.js";
import { db } from "../db.js";
import { eq } from "drizzle-orm";
import { verifyToken } from "../middleware/authMiddleware.js";

const notebooksRoute = new Hono();
notebooksRoute.use("*", verifyToken);

notebooksRoute.post("/notebooks", async (c) => {
  const body = await c.req.json();
  const userId = body.userId; // ex: 1
  const title = body.title || "Untitled";

  const [notebook] = await db
    .insert(notebooks)
    .values({ userId, title })
    .returning({ id: notebooks.id });

  return c.json({ id: notebook.id });
});

notebooksRoute.patch("/notebooks/:id", async (c) => {
  const id = c.req.param("id");
  const { title } = await c.req.json();
  const userId = c.get("user").id;

  if (!title || typeof title !== "string") {
    return c.json({ error: "Invalid title" }, 400);
  }

  // verifică dacă userul are voie
  const existing = await db.query.notebooks.findFirst({
    where: (notebooks, { eq, and }) =>
      and(eq(notebooks.id, id), eq(notebooks.userId, userId)),
  });

  if (!existing) {
    return c.json({ error: "Not allowed" }, 403);
  }

  await db.update(notebooks).set({ title }).where(eq(notebooks.id, id));

  return c.json({ success: true });
});

notebooksRoute.get("/notebooks", async (c) => {
  const userId = c.get("user").id;
  const result = await db.query.notebooks.findMany({
    where: (notebooks, { eq }) => eq(notebooks.userId, userId),
    orderBy: (notebooks, { desc }) => [
      desc(notebooks.isPinned),
      desc(notebooks.updatedAt),
    ],
    with: {
      pages: {
        limit: 1,
        orderBy: (notebookPages, { asc }) => [asc(notebookPages.createdAt)],
      },
    },
  });
  return c.json(result);
});

notebooksRoute.get("/notebooks/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("user").id;

  const result = await db.query.notebooks.findFirst({
    where: (notebooks, { eq, and }) =>
      and(eq(notebooks.id, id), eq(notebooks.userId, userId)),
  });

  if (!result) {
    return c.json({ error: "Not allowed" }, 403);
  }

  return c.json(result);
});

notebooksRoute.get("/notebook-pages", async (c) => {
  const { notebookId } = c.req.query();
  const userId = c.get("user").id;

  const notebook = await db.query.notebooks.findFirst({
    where: (notebooks, { eq, and }) =>
      and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)),
  });

  if (!notebook) {
    return c.json({ error: "Not allowed" }, 403);
  }

  const result = await db.query.notebookPages.findMany({
    where: (notebookPages, { eq }) => eq(notebookPages.notebookId, notebookId),
    orderBy: (notebookPages, { asc }) => [asc(notebookPages.createdAt)],
  });

  return c.json(result);
});

notebooksRoute.patch("/notebooks/:id/pin", async (c) => {
  const userId = c.get("user").id;
  const id = c.req.param("id");

  const notebook = await db.query.notebooks.findFirst({
    where: (notebooks, { eq }) => eq(notebooks.id, id),
  });

  if (!notebook || notebook.userId !== userId) {
    return c.json({ error: "Not allowed" }, 403);
  }

  await db
    .update(notebooks)
    .set({ isPinned: !notebook.isPinned, updatedAt: new Date() })
    .where(eq(notebooks.id, id));

  return c.json({ success: true, isPinned: !notebook.isPinned });
});

export default notebooksRoute;
