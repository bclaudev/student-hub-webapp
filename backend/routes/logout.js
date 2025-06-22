import { Hono } from "hono";

const logoutRoute = new Hono();

logoutRoute.post("/logout", (c) => {
  c.header(
    "Set-Cookie",
    "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
  );
  return c.json({ message: "Logged out" });
});

export default logoutRoute;
