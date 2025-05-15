import { Hono } from 'hono';
import { db } from '../db.js';
import { notebookPages } from "../drizzle/schema.js";
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const pagesRoute = new Hono();

const pageSchema = z.object({
  notebookId: z.string().uuid(),
  title: z.string().min(1),
  content: z.any(), // JSON Tiptap
});

pagesRoute.post(
  '/api/notebook-pages',
  zValidator('json', pageSchema),
  async (c) => {
    const body = await c.req.valid('json');

    const result = await db.insert(notebookPages).values({
      notebookId: body.notebookId,
      title: body.title,
      content: JSON.stringify(body.content),
    });

    return c.json({ success: true });
  }
);

export default pagesRoute;
