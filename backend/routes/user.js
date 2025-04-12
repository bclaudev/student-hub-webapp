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

export default userRoute;
