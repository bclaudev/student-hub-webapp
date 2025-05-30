import { Hono } from "hono";
import { db } from "../db.js";
import { resourcesTable } from "../drizzle/schema.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

const resourcesRoute = new Hono();

resourcesRoute.use("*", verifyToken);

resourcesRoute.get("/", async (c) => {
  const user = c.get("user");

  try {
    const resources = await db.execute(sql`
      SELECT
    r.id,
    r.name,
    r.file_path,
    r.file_type,
    r.uploaded_at,
    json_agg(json_build_object('id', g.id, 'name', g.name)) FILTER (WHERE g.id IS NOT NULL) AS tags
  FROM resources r
  LEFT JOIN resource_to_group rtg ON r.id = rtg.resource_id
  LEFT JOIN resource_groups g ON g.id = rtg.group_id
  WHERE r.uploaded_by = ${user.id}
  GROUP BY r.id
  ORDER BY r.uploaded_at DESC
    `);

    return c.json(resources);
  } catch (err) {
    console.error("❌ Eroare în GET /resources:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default resourcesRoute;
