import { Hono } from "hono";
import { notebooks } from "../drizzle/schema.js";
import { db } from "../db.js";
import { eq } from "drizzle-orm";


const notebooksRoute = new Hono();

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
    const body = await c.req.json();
  
    if (!body.title || typeof body.title !== "string") {
      return c.json({ error: "Invalid title" }, 400);
    }
  
    await db
      .update(notebooks)
      .set({ title: body.title })
      .where(eq(notebooks.id, id));
  
    return c.json({ success: true });
  });

notebooksRoute.get("/notebooks", async (c) => {
    const result = await db.select().from(notebooks);
    return c.json(result);
});

notebooksRoute.get("/notebooks/:id", async (c) => {
    const id = c.req.param("id");
    const result = await db.query.notebooks.findFirst({
      where: (notebooks, { eq }) => eq(notebooks.id, id),
    });
    return c.json(result);
  });

notebooksRoute.get("/notebook-pages", async (c) => {
    const { notebookId } = c.req.query();
    const result = await db.query.notebookPages.findMany({
        where: (notebookPages, { eq }) => eq(notebookPages.notebookId, notebookId),
        orderBy: (notebookPages, { asc }) => [asc(notebookPages.createdAt)],
    });
    return c.json(result);
});
  
  

export default notebooksRoute;
