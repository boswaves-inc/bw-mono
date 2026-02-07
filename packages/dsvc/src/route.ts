import type { NatsConfig, ModuleInfo } from "./types"
import { pathToFileURL } from "url";
import { readdirSync } from "fs";
import { join } from "path";

const __ext = /\.(ts|tsx|jsx|js|mjs|cjs)$/;
const __cwd = process.cwd();
const __file = readdirSync(__cwd)
    .find((file) => file.replace(__ext, '') === 'dsvc.config');

if (!__file) {
    throw new Error('No dsvc config found');
}

const config = await (async () => {
    const args = await import(pathToFileURL(join(__cwd, __file)).href)
    const { namespace, routes, types } = args.default as NatsConfig

    if (!namespace) {
        throw new Error('Config missing: namespace');
    }

    if (!routes) {
        throw new Error('Config missing: routes');
    }

    return {
        input: routes,
        output: join(process.cwd(), types ?? '.dsvc-router'),
        namespace,
    }
})()


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
            subject: `${config.namespace}.${file.replace(__ext, '')}`,
        }
    }))

    return topics
}