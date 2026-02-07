import { Nats } from "@boswaves-inc/nats-router";
import { Logger } from "@boswaves-inc/logger";

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

const router = new Nats({
    logger: log_client,
    group: 'boswaves-inc/smtp',
    servers: [
        'host.docker.internal:4222'
    ],
})

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

    await router.listen({})
}

// Start the worker
main().catch(async (err) => {
    console.error('Failed to start worker:', err);

    await router.disconnect()

    process.exit(1);
});