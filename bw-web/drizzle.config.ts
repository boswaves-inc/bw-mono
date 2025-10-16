import { defineConfig } from 'drizzle-kit'

if (!process.env.PG_DATABASE) {
    throw new Error("PG_USERNAME is not defined");
}

if (!process.env.PG_USERNAME) {
    throw new Error("PG_USERNAME is not defined");
}

if (!process.env.PG_PASSWORD) {
    throw new Error("PG_USERNAME is not defined");
}

export default defineConfig({
    out: './drizzle',
    schema: '/database/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.PG_HOST ?? '127.0.0.1',
        port: Number(process.env.PG_PORT) ?? 5432,
        user: process.env.PG_USERNAME,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
    }
})