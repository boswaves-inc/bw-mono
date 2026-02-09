import { Dsvc } from "@boswaves-inc/dsvc";
import { Logger } from "@boswaves-inc/log";

const log_client = new Logger({
    level: 'debug'
})

const router = new Dsvc({
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