import { Hono } from "hono";
import { db } from "../db.js";
import { resourceGroupsTable } from "../drizzle/schema.js";
import { resourceToGroupTable } from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";
import { verifyToken } from "../middleware/authMiddleware.js";
import { sql } from "drizzle-orm";

const tagsRoute = new Hono();

tagsRoute.use("*", verifyToken);

tagsRoute.get("/tags", async (c) => {
  try {
    const user = c.get("user");

    const tags = await db.execute(
      sql`
      SELECT g.id, g.name, COUNT(rtg.resource_id)::int AS count
      FROM resource_groups g
      LEFT JOIN resource_to_group rtg ON g.id = rtg.group_id
      WHERE g.created_by = ${user.id} OR g.is_global = true
      GROUP BY g.id
      ORDER BY g.is_global DESC, g.name
    `
    );
    console.log("👤 user.id =", user?.id);
    console.log(">>> TAGS RAW:", tags);

    return c.json(tags);
    // folosim rows pentru .execute()
  } catch (error) {
    console.error("❌ Eroare în GET /tags:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

tagsRoute.post("/tags", async (c) => {
  try {
    const user = c.get("user");
    const { name, fileId: rawFileId } = await c.req.json();
    const fileId = parseInt(rawFileId, 10);

    if (!name || !fileId) {
      return c.json({ error: "Missing name or fileId" }, 400);
    }

    // 1. Caută dacă există deja tagul pentru acest user
    const existing = await db
      .select()
      .from(resourceGroupsTable)
      .where(
        and(
          eq(resourceGroupsTable.name, name),
          eq(resourceGroupsTable.createdBy, user.id)
        )
      );

    let tagId;
    if (existing.length > 0) {
      tagId = existing[0].id;
    } else {
      const inserted = await db
        .insert(resourceGroupsTable)
        .values({ name, createdBy: user.id })
        .returning();
      tagId = inserted[0].id;
    }

    // 2. Creează legătura în tabela many-to-many
    await db.insert(resourceToGroupTable).values({
      resourceId: fileId,
      groupId: tagId,
    });

    return c.json({ success: true, name, id: tagId });
  } catch (error) {
    console.error("❌ Eroare în POST /tags:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default tagsRoute;
