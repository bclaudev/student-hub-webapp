import { Hono } from "hono";
import { db } from "../db.js";
import { resourcesTable } from "../drizzle/schema.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { eq } from "drizzle-orm";

const resourcesRoute = new Hono();

resourcesRoute.use("*", verifyToken);

resourcesRoute.get("/", async (c) => {
  const user = c.get("user");
  const userId = user.id;

  const resources = await db
    .select()
    .from(resourcesTable)
    .where(eq(resourcesTable.uploadedBy, userId));

  return c.json(resources);
});

export default resourcesRoute;
