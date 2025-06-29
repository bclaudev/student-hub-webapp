import { Hono } from "hono";
import { db } from "../db.js";
import { resourceGroupsTable } from "../drizzle/schema.js";
import { resourceToGroupTable } from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";
import { verifyToken } from "../middleware/authMiddleware.js";
import { sql } from "drizzle-orm";
import { posthog } from "../lib/posthog.js";

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
  } catch (error) {
    console.error(" Eroare în GET /tags:", error);
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

    posthog.capture({
      distinctId: String(user.id),
      event: "tag_created",
      properties: {
        tagId,
        tagName: name,
        fileId,
        isGlobal: false,
        createdAt: new Date().toISOString(),
      },
    });

    // 2. Creează legătura în tabela many-to-many
    await db.insert(resourceToGroupTable).values({
      resourceId: fileId,
      groupId: tagId,
    });

    return c.json({ success: true, name, id: tagId });
  } catch (error) {
    console.error("Eroare în POST /tags:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

tagsRoute.post("/tags/create-and-assign", async (c) => {
  try {
    const user = c.get("user");
    const { tagName, resourceId } = await c.req.json();

    if (!tagName || !resourceId) {
      return c.json({ error: "Missing tagName or resourceId" }, 400);
    }

    // Caută dacă există deja un tag cu acest nume
    let tag = await db.query.resourceGroupsTable.findFirst({
      where: and(
        eq(resourceGroupsTable.name, tagName),
        eq(resourceGroupsTable.createdBy, user.id)
      ),
    });

    if (!tag) {
      const inserted = await db
        .insert(resourceGroupsTable)
        .values({ name: tagName, createdBy: user.id })
        .returning();
      tag = inserted[0];
    }

    // Creează legătura many-to-many
    await db.insert(resourceToGroupTable).values({
      resourceId,
      groupId: tag.id,
    });

    posthog.capture({
      distinctId: String(user.id),
      event: "tag_assigned",
      properties: {
        tagId: tag.id,
        tagName,
        resourceId,
        autoFrom: "class_curriculum",
      },
    });

    return c.json({ success: true, tagId: tag.id });
  } catch (error) {
    console.error("Eroare în POST /tags/create-and-assign:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default tagsRoute;
