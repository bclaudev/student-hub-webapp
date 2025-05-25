import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db.js";
import { serve } from "@hono/node-server";
import { usersTable } from "./drizzle/schema.js";
import "dotenv/config";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import userRoute from "./routes/user.js";
import eventsRoutes from "./routes/events.js";
import notebooksRoute from "./routes/notebooks.js";
import notebookPagesRoute from "./routes/notebook-pages.js";
import uploadRoute from "./routes/upload.js";
import resourcesRoute from "./routes/resources.js";
import { classesRoute } from "./routes/classes.js";
import { serveStatic } from "@hono/node-server/serve-static";
import tagsRoute from "./routes/tags.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads/*", serveStatic({ root: "./" }));

app.get("/", (c) => c.text("Hello from Claudia’s backend"));

app.get("/users", async (c) => {
  const result = await db.select().from(users);
  return c.json(result);
});

app.route("/register", registerRoute);
app.route("/login", loginRoute);
app.route("/api/user", userRoute);
app.route("/api/events", eventsRoutes);
app.route("/api", notebooksRoute);
app.route("/api", notebookPagesRoute);
app.route("/api", uploadRoute);
app.route("/api/resources", resourcesRoute);
app.route("/api", tagsRoute);
app.route("/api/classes", classesRoute);

const port = 8787;

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`Hono server running at http://localhost:${port}`);
  }
);
