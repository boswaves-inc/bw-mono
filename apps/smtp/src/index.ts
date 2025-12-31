import postgres from "postgres";
import { Postgres } from '@boswaves/core/postgres'
import * as schema from '@boswaves/core/schema'
import { drizzle } from "drizzle-orm/postgres-js";
import { Smtp } from "./smtp";

import config from './config'
import { render } from "@react-email/render";

const main = async () => {
    console.log('smtp starting...');

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

    const smtp_client = new Smtp(config.smtp)
    const pg_client = drizzle(query_client, { schema });

    await event_client.listen('email_queued', async (id) => {
        console.log(id)

    })

    console.log('smtp ready...\n');

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