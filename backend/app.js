import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { db } from './db.js'
import { serve } from '@hono/node-server'
import { usersTable } from './drizzle/schema.js'
import 'dotenv/config'
import registerRoute from './routes/register.js'
import loginRoute from './routes/login.js'

const app = new Hono()

app.use('*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => c.text('Hello from Claudia’s backend'))

app.get('/users', async (c) => {
  const result = await db.select().from(users)
  return c.json(result)
})

app.route('/register', registerRoute)
app.route('/login', loginRoute)

const port = 8787

serve({
  fetch: app.fetch,
  port,
}, () => {
  console.log(`🚀 Hono server running at http://localhost:${port}`)
})
