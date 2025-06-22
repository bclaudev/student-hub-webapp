import { db } from "../db.js";
import {
  usersTable,
  resourcesTable,
  calendarEventsTable,
  notebooks,
  classesTable,
} from "../drizzle/schema.js";
import { eq, gte, count } from "drizzle-orm";
import { getTodayStart } from "../lib/utils.js";
import { verifyToken } from "../middleware/authMiddleware.js";

export function registerAdminRoutes(app) {
  app.use("/api/admin/*", verifyToken);

  app.get("/api/admin/overview", async (c) => {
    const authUser = c.get("user");
    if (authUser?.role !== "admin") {
      return c.json({ error: "Unauthorized" }, 403);
    }

    // Total users
    const totalUsers = await db.select({ value: count() }).from(usersTable);
    const usersCount = totalUsers[0]?.value ?? 0;

    // Total resources
    const totalResources = await db
      .select({ value: count() })
      .from(resourcesTable);
    const resourcesCount = totalResources[0]?.value ?? 0;

    // Total events
    const totalEvents = await db
      .select({ value: count() })
      .from(calendarEventsTable);
    const eventsCount = totalEvents[0]?.value ?? 0;

    const totalClassesResult = await db
      .select({ value: count() })
      .from(classesTable);

    const totalClasses = totalClassesResult[0]?.value ?? 0;

    // Events today
    const today = getTodayStart();
    const eventsTodayResult = await db
      .select({ value: count() })
      .from(calendarEventsTable)
      .where(gte(calendarEventsTable.startDateTime, today));
    const eventsTodayCount = eventsTodayResult[0]?.value ?? 0;

    // Total notebooks
    const totalNotebooks = await db.select({ value: count() }).from(notebooks);
    const notebooksCount = totalNotebooks[0]?.value ?? 0;

    return c.json({
      totalUsers: usersCount,
      totalResources: resourcesCount,
      totalEvents: eventsCount,
      eventsToday: eventsTodayCount,
      totalNotebooks: notebooksCount,
      totalClasses: totalClasses,
    });
  });

  app.get("/api/admin/users", async (c) => {
    const authUser = c.get("user");
    if (authUser?.role !== "admin") {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const users = await db.select().from(usersTable);
    return c.json({ users }); // 👈 wrap în obiect
  });

  app.delete("/api/admin/users/:id", async (c) => {
    const authUser = c.get("user");
    if (authUser?.role !== "admin") {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const { id } = c.req.param();

    // Nu permite ștergerea userilor admin
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, Number(id)),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    if (user.role === "admin") {
      return c.json({ error: "Cannot delete admin user" }, 400);
    }

    await db.delete(usersTable).where(eq(usersTable.id, Number(id)));

    return c.json({ success: true });
  });
}
