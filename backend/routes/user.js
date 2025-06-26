import { Hono } from "hono";
import { verifyToken } from "../middleware/authMiddleware.js";
import { usersTable } from "../drizzle/schema.js";
import { db } from "../db.js";
import { eq } from "drizzle-orm";

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

  const allUsers = await db.select().from(users);
  return c.json(allUsers);
});

userRoute.put("/name", async (c) => {
  const user = c.get("user");
  const { firstName, lastName } = await c.req.json();

  if (!firstName || !lastName) {
    return c.json({ error: "Missing fields" }, 400);
  }

  await db
    .update(usersTable)
    .set({ firstName, lastName })
    .where(eq(usersTable.id, user.id));

  const updatedUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, user.id),
  });

  return c.json({ success: true, user: updatedUser });
});

userRoute.put("/email", async (c) => {
  const user = c.get("user");
  const { currentEmail, newEmail, password } = await c.req.json();

  if (!currentEmail || !newEmail || !password) {
    return c.json({ error: "Missing fields" }, 400);
  }

  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, user.id),
  });

  if (!existingUser || existingUser.email !== currentEmail) {
    return c.json({ error: "Incorrect current email" }, 400);
  }

  if (password !== existingUser.password) {
    return c.json({ error: "Invalid password" }, 401);
  }

  await db
    .update(usersTable)
    .set({ email: newEmail })
    .where(eq(usersTable.id, user.id));

  const updatedUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, user.id),
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      dateOfBirth: true,
    },
  });

  return c.json({ success: true, user: updatedUser });
});

export default userRoute;
