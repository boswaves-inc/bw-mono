import { Svc } from "@boswaves-inc/svc";
import { Logger } from "@boswaves-inc/tracing";
import { Postgres } from "./services/postgres";

import config from './config'

const log_client = new Logger({
    level: 'debug'
})

const router = new Svc({
    logger: log_client,
    group: '@boswaves-inc/billing',
    servers: [
        'host.docker.internal:4222'
    ],
})


const pg_client = new Postgres({
    logger: log_client,
    config: config.postgres
});

const main = async () => {
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
        postgres: pg_client
    })
}

// Start the worker
main().catch(async (err) => {
    console.error('Failed to start worker:', err);

    await router.disconnect()

    process.exit(1);
});