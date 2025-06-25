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
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { posthog } from "../lib/posthog.js";
import { usersTable } from "../drizzle/schema.js";
import { eq, sql } from "drizzle-orm";

async function extractAuthor(filePath, fileType) {
  try {
    if (fileType === "application/pdf") {
      const buffer = await fs.promises.readFile(filePath);
      const pdfDoc = await PDFDocument.load(buffer);
      const author = pdfDoc.getAuthor();
      return author || null;
    }

    if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const buffer = await fs.promises.readFile(filePath);
      const zip = await JSZip.loadAsync(buffer);
      const coreXml = await zip.file("docProps/core.xml")?.async("text");
      if (!coreXml) return null;

      const parser = new XMLParser();
      const parsed = parser.parse(coreXml);
      return parsed["cp:coreProperties"]?.["dc:creator"] || null;
    }

    return null;
  } catch (err) {
    console.warn("Nu s-a putut extrage autorul:", err);
    return null;
  }
}

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
        console.error("Eroare la conversia DOCX -> PDF:", err);
      }
    }

    const author = await extractAuthor(finalFilePath, finalFileType);

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
        console.error("Eroare la generare thumbnail:", err);
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
        author,
      })
      .returning();

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    await db
      .update(usersTable)
      .set({
        uploadSize: sql`${usersTable.uploadSize} + ${totalSize}`,
      })
      .where(eq(usersTable.id, userId));

    posthog.capture({
      distinctId: userId,
      event: "resource_uploaded",
      properties: {
        totalFiles: files.length,
        totalSizeBytes: totalSize,
        totalSizeMB: +(totalSize / 1024 / 1024).toFixed(2),
      },
    });

    console.log(" Event trimis spre PostHog!");

    saved.push({
      ...inserted[0],
      thumbnailPath,
    });

    // Dacă am generat PDF temporar pentru DOCX, îl ștergem pe cel original
    if (ext === ".docx") {
      try {
        fs.unlinkSync(originalFilePath);
      } catch (e) {
        console.warn("Nu am putut șterge DOCX:", e);
      }
    }
  }

  await posthog.flush();
  return c.json({ success: true, uploaded: saved });
});

export default uploadRoute;
