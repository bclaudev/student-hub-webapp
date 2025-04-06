import { Hono } from 'hono'
import { db } from './db.js'
import { users } from './drizzle/schema.js'
import 'dotenv/config'

const app = new Hono()

app.get('/', (c) => c.text('Hello from Claudia’s backend'))

app.get('/users', async (c) => {
  const result = await db.select().from(users)
  return c.json(result)
})

const port = 3000
Bun ? app.fetch : app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
