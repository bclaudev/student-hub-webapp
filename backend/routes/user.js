import { Hono } from "hono";
import { verifyToken } from "../middleware/authMiddleware.js";

const userRoute = new Hono();

userRoute.use("*", verifyToken); // Middleware that adds `user` to the context

userRoute.get("/", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Return user info (customize as needed)
  return c.json({ user });
});

userRoute.get("/all", async (c) => {
  const currentUser = c.get("user");

  if (currentUser.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }

  const allUsers = await db.select().from(users); // Drizzle ORM
  return c.json(allUsers);
});

export default userRoute;
