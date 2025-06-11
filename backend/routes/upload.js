import { Hono } from "hono";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { db } from "../db.js";
import { resourcesTable } from "../drizzle/schema.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { promisify } from "util";
import fs from "fs";

const execAsync = promisify(exec);
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
  await mkdir("uploads/thumbnails", { recursive: true });

  const saved = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name).toLowerCase();
    const originalFileName = `${randomUUID()}${ext}`;
    const originalFilePath = `uploads/${originalFileName}`;
    await writeFile(originalFilePath, buffer);

    let finalFilePath = originalFilePath;
    let finalFileType = file.type;
    let thumbnailPath = null;

    // Dacă e DOCX, convertește în PDF
    if (ext === ".docx") {
      const pdfName = `${randomUUID()}.pdf`;
      const pdfPath = `uploads/${pdfName}`;
      try {
        await execAsync(
          `soffice --headless --convert-to pdf --outdir uploads ${originalFilePath}`
        );
        finalFilePath = `uploads/${path.basename(
          originalFilePath,
          ".docx"
        )}.pdf`;
        finalFileType = "application/pdf";
      } catch (err) {
        console.error("❌ Eroare la conversia DOCX -> PDF:", err);
      }
    }

    // Dacă este PDF, generează thumbnail
    if (finalFilePath.endsWith(".pdf")) {
      const thumbName = `${randomUUID()}.jpg`;
      const thumbPath = `uploads/thumbnails/${thumbName}`;
      try {
        await execAsync(
          `pdftoppm -jpeg -f 1 -singlefile "${finalFilePath}" "${thumbPath.replace(
            /\.jpg$/,
            ""
          )}"`
        );
        thumbnailPath = `/${thumbPath}`;
      } catch (err) {
        console.error("❌ Eroare la generare thumbnail:", err);
      }
    }

    const inserted = await db
      .insert(resourcesTable)
      .values({
        name: file.name,
        filePath: `/${finalFilePath}`,
        fileType: finalFileType,
        fileSize: file.size,
        uploadedBy: userId,
        // thumbnailPath nu e în schema, dar poți trimite în response pentru frontend
      })
      .returning();

    saved.push({
      ...inserted[0],
      thumbnailPath,
    });

    // Dacă am generat PDF temporar pentru DOCX, îl ștergem pe cel original
    if (ext === ".docx") {
      try {
        fs.unlinkSync(originalFilePath);
      } catch (e) {
        console.warn("⚠️ Nu am putut șterge DOCX:", e);
      }
    }
  }

  return c.json({ success: true, uploaded: saved });
});

export default uploadRoute;
