import { Nats } from "@boswaves-inc/nats-router";
import { Logger } from "./services/logger";
import { Postgres } from './services/postgres';
import { Smtp } from "./services/smtp";

if (!process.env.SMTP_HOST) {
    throw new Error('SMTP_HOST variable not set')
}

if (!process.env.SMTP_EMAIL) {
    throw new Error('SMTP_EMAIL variable not set')
}

if (!process.env.SMTP_PASSWORD) {
    throw new Error('SMTP_PASSWORD variable not set')
}

const log_client = new Logger({
    level: 'debug'
})

const pg_client = new Postgres({
    logger: log_client,
    config: {
        port: process.env.PG_HOST ? Number(process.env.PG_HOST) : 5432,
        host: process.env.PG_HOST ?? 'localhost',
        username: process.env.PG_USERNAME,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
    }
});

const smtp_client = new Smtp({
    postgres: pg_client,
    options: {
        pool: true,
        secure: true,
        maxConnections: 5,
        maxMessages: 100,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    }
})

const router = new Nats({
    logger: log_client,
    group: 'boswaves-inc/smtp',
    servers: [
        'host.docker.internal:4222'
    ],
})



const main = async () => {
    // const elements = await loadElementMap()
    // const routes = await loadRouteMap()

    // const primitive_type = z.union([
    //     z.string(),
    //     z.number()
    // ])

    // const element_type = z.discriminatedUnion<any, 'type'>('type', Object.entries(elements).map(([key, { schema }]) => {
    //     return schema.extend({
    //         type: z.literal(key),
    //         content: z.lazy(() => content_type).optional()
    //     })
    // }))

    // const content_type = z.lazy(() =>
    //     z.union([element_type, primitive_type, z.array(content_type)])
    // )

    // for (const [topic, { module, key }] of Object.entries(base)) {
    //     const { default: factory, schema, handle } = module;
    //     const beginning = handle?.from_beginning;

    //     const route_type = schema.extend({
    //         content: content_type
    //     })

    //     kafka_client.on(topic, route_type, factory, beginning);
    // }

    // Handle uncaught exceptions

    process.on('uncaughtException', async (err) => {
        console.error('Uncaught exception:', err);
        await router.disconnect()

        process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
        console.error('Unhandled rejection at:', promise, 'reason:', reason);
        await router.disconnect()

        process.exit(1);
    });

    await router.listen({
        postgres: pg_client,
        smtp: smtp_client,
    })
}

// Start the worker
main().catch(async (err) => {
    console.error('Failed to start worker:', err);

    await router.disconnect()

    process.exit(1);
});