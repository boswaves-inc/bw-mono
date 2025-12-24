import postgres from "postgres";
import { Postgres } from '@bw/core/postgres'
import * as schema from '@bw/core/schema'
import { drizzle } from "drizzle-orm/postgres-js";
import { Smtp } from "./smtp";

const main = async () => {
    console.log('worker starting...');

    const query_client = postgres({
        port: process.env.PG_HOST ? Number(process.env.PG_HOST) : 5432,
        host: process.env.PG_HOST ?? 'localhost',
        username: process.env.PG_USERNAME,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD
    })

    const event_client = postgres({
        port: process.env.PG_HOST ? Number(process.env.PG_HOST) : 5432,
        host: process.env.PG_HOST ?? 'localhost',
        username: process.env.PG_USERNAME,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD
    })

    const smtp_client = new Smtp({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'francesca.bailey@ethereal.email',
            pass: 'eahGbsXKCBct3GEW5S'
        }
    })

    const pg_client = drizzle(query_client, { schema });

    await event_client.listen('email_queued', async (payload) => {
        console.log('test')
    })

    console.log('worker ready...\n');

}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the worker
main().catch((err) => {
    console.error('Failed to start worker:', err);
    process.exit(1);
});