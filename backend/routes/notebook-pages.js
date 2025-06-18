import { Hono } from "hono";
import { notebookPages, notebooks } from "../drizzle/schema.js";
import { db } from "../db.js";
import { eq, and } from "drizzle-orm";
import { verifyToken } from "../middleware/authMiddleware.js";

const notebookPagesRoute = new Hono();
notebookPagesRoute.use("*", verifyToken);

notebookPagesRoute.post("/notebook-pages", async (c) => {
  const body = await c.req.json();
  const { notebookId, title, content } = body;
  const userId = c.get("user").id;

  const notebook = await db.query.notebooks.findFirst({
    where: (notebooks, { eq, and }) =>
      and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)),
  });

  if (!notebook) {
    return c.json({ error: "Not allowed" }, 403);
  }

  const [newPage] = await db
    .insert(notebookPages)
    .values({
      notebookId,
      title,
      content: JSON.stringify(content),
    })
    .returning({ id: notebookPages.id });

  return c.json({ success: true, id: newPage.id });
});

notebookPagesRoute.patch("/notebook-pages/:id", async (c) => {
  try {
    const id = c.req.param("id")?.trim();
    const body = await c.req.json();
    const userId = c.get("user").id;

    console.log("🔍 PATCH request for page:", id);
    console.log("👤 User ID:", userId);

    const page = await db.query.notebookPages.findFirst({
      where: (notebookPages, { eq }) => eq(notebookPages.id, id),
      with: {
        notebook: true,
      },
    });

    if (!page) {
      console.error("❌ Page not found in DB!");
      return c.json({ error: "Page not found" }, 404);
    }

    if (page.notebook.userId !== userId) {
      console.error("❌ Page does not belong to current user!");
      return c.json({ error: "Not allowed" }, 403);
    }

    const before = await db.query.notebookPages.findFirst({
      where: (notebookPages, { eq }) => eq(notebookPages.id, id),
    });
    console.log("🧠 Content BEFORE update:", before?.content);

    await db
      .update(notebookPages)
      .set({ content: JSON.stringify(body.content), updatedAt: new Date() }) // sau `.set({ content: "TEST STRING SALVAT" })` pentru test
      .where(eq(notebookPages.id, id));

    await db
      .update(notebooks)
      .set({ updatedAt: new Date() })
      .where(eq(notebooks.id, page.notebookId));

    const after = await db.query.notebookPages.findFirst({
      where: (notebookPages, { eq }) => eq(notebookPages.id, id),
    });
    console.log("✅ Content AFTER update:", after?.content);

    return c.json({ success: true });
  } catch (err) {
    console.error("💥 PATCH notebook-page error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default notebookPagesRoute;
