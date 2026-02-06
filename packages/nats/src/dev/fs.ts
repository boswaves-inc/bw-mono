import { readdirSync } from "fs";
import type { NatsConfig, ModuleInfo } from "../types"
import { join } from "path";
import { pathToFileURL } from "url";

const __ext = /\.(ts|tsx|jsx|js|mjs|cjs)$/;
const __cwd = process.cwd();
const __file = readdirSync(__cwd)
    .find((file) => file.replace(__ext, '') === 'nats.config');

if (!__file) {
    throw new Error('No nats config found');
}

const path = join(__cwd, __file);
const config = await import(pathToFileURL(path).href).then(({ default: { namespace, routes, out } }: { default: Partial<NatsConfig> }) => {
    if (!namespace) {
        throw new Error('Config missing: namespace');
    }

    if (!routes) {
        throw new Error('Config missing: routes');
    }

    return {
        out: join(process.cwd(), out ?? '.nats-router'),
        routes: join(process.cwd(), routes),
        input: routes,
        namespace,
    }
});

export const flatRoutes = async () => {
    const routes = join(__cwd, config.input, 'routes')
    const files = readdirSync(routes)
        .filter((file) => __ext.test(file))
        .filter((file) => !file.startsWith('_'))

    // Load the route topic
    const topics = await Promise.all(files.map(async file => {
        const module: ModuleInfo = await import(join(routes, file))

        return {
            module,
            key: file.replace(__ext, ''),
            // topic: `${config.namespace}.${file.replace(__ext, '')}`,
            subject: `${config.namespace}.${file.replace(__ext, '')}`,
        }
    }))

    return topics
}