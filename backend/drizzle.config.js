import 'dotenv/config'

export default {
    schema: './drizzle/schema.js',
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        host: 'localhost',
        user: 'postgres',
        password: 'admin',
        database: 'student_hub',
      },
}