import { Hono } from "hono"
import { registerUser } from "../controllers/registerController.js"

const registerRoute = new Hono()

registerRoute.post("/", async (c) => {
  const body = await c.req.json()
  if (!body) {
    return c.json({ message: "Request body is required." }, 400)
  }

  return await registerUser(c)
})

export default registerRoute
