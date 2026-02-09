if (!process.env.PG_DATABASE) {
    throw new Error("PG_DATABASE is not defined");
}

if (!process.env.PG_USERNAME) {
    throw new Error("PG_USERNAME is not defined");
}

if (!process.env.PG_PASSWORD) {
    throw new Error("PG_PASSWORD is not defined");
}

export default {
    postgres: {
        user: String(process.env.PG_USERNAME),
        password: String(process.env.PG_PASSWORD),
        database: String(process.env.PG_DATABASE),
        host: process.env.PG_HOST ? String(process.env.PG_HOST) : 'localhost',
        port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
    }
}