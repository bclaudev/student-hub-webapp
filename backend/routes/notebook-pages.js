// routes/notebook-pages.js
import { Hono } from "hono";
import { notebookPages } from "../drizzle/schema.js";
import { db } from "../db.js";
import { uuid } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

const notebookPagesRoute = new Hono();

notebookPagesRoute.post("/notebook-pages", async (c) => {
  const body = await c.req.json();

  const { notebookId, title, content } = body;

  if (!notebookId || !title || !content) {
    return c.json({ error: "Missing fields" }, 400);
  }

  await db.insert(notebookPages).values({
    notebookId,
    title,
    content: JSON.stringify(content),
  });

  return c.json({ success: true });
});

notebookPagesRoute.patch("/notebook-pages/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
  
    if (!body.content) {
      return c.json({ error: "Conținut lipsă" }, 400);
    }
  
    await db
      .update(notebookPages)
      .set({ content: JSON.stringify(body.content) })
      .where(eq(notebookPages.id, id));
  
    return c.json({ success: true });
  });
  

export default notebookPagesRoute;
