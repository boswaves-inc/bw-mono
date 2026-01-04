import { Logger } from "./services/logger";
import { Kafka } from "./services/kafka";
import { Postgres } from './services/postgres';
import { Smtp } from "./services/smtp";
import routes from "./routes";

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
        maxConnections: 5,
        maxMessages: 100,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 5432,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    }
})

const kafka_client = new Kafka({
    logger: log_client,
    config: {
        clientId: 'boswaves/smtp',
        brokers: ['host.docker.internal:9092'],
    },
})

const main = async () => {
    const route_map = await routes()

    for (const [topic, { module, key }] of Object.entries(route_map)) {
        const { default: factory, schema, handle } = module;
        const beginning = handle?.from_beginning;

        kafka_client.on(topic, factory, beginning);
    }

    // Handle uncaught exceptions
    process.on('uncaughtException', async (err) => {
        console.error('Uncaught exception:', err);
        await kafka_client.disconnect()

        process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
        console.error('Unhandled rejection at:', promise, 'reason:', reason);
        await kafka_client.disconnect()

        process.exit(1);
    });

    await kafka_client.connect()
    await kafka_client.run({
        logger: log_client,
        postgres: pg_client,
        smtp: smtp_client,
    })
}

// Start the worker
main().catch(async (err) => {
    console.error('Failed to start worker:', err);
    await kafka_client.disconnect()

    process.exit(1);
});