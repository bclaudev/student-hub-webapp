import { Hono } from "hono";
import Busboy from "busboy";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { db } from "../db.js";
import { resourcesTable } from "../drizzle/schema.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const uploadRoute = new Hono();

uploadRoute.use("/upload", verifyToken);

uploadRoute.post("/upload", async (c) => {
  const user = c.get("user");
  const userId = user.id;

  const form = await c.req.formData();
  const files = form.getAll("files");

  if (!files || files.length === 0) {
    return c.json({ error: "No files uploaded" }, 400);
  }

  await mkdir("uploads", { recursive: true });
  const saved = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const fileName = `${randomUUID()}${ext}`;
    const filePath = `uploads/${fileName}`;

    await writeFile(filePath, buffer);

    const inserted = await db
      .insert(resourcesTable)
      .values({
        name: file.name,
        filePath: `/${filePath}`, // pentru a fi servit corect
        fileType: file.type,
        fileSize: file.size,
        uploadedBy: userId,
      })
      .returning();

    saved.push(inserted[0]);
  }

  return c.json({ success: true, uploaded: saved });
});

export default uploadRoute;
