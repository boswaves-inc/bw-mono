import type { DsvcConfig, ModuleInfo } from "./types"
import { pathToFileURL } from "url";
import { readdirSync, statSync } from "fs";
import { join, relative } from "path";

const __ext = /\.(ts|tsx|jsx|js|mjs|cjs)$/;
const __cwd = process.cwd();
const __file = readdirSync(__cwd)
    .find((file) => file.replace(__ext, '') === 'dsvc.config');

if (!__file) {
    throw new Error('No dsvc config found');
}

const config = await (async () => {
    const args = await import(pathToFileURL(join(__cwd, __file)).href)
    const { namespace, routes, types } = args.default as DsvcConfig

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

const discoverRoutes = (dir: string, matches: string[] = []): { key: string, path: string }[] => {
    return readdirSync(dir).flatMap(match => {
        const path = join(dir, match);
        const stat = statSync(path);

        if (stat.isDirectory()) {
            return discoverRoutes(path, matches.concat(match))
        }
        else if (__ext.test(match)) {
            const entries = matches.concat(match.replace(__ext, ''))

            return {
                matches: entries,
                key: entries.join('.'),
                path: path.replace(dir + '/', ''),
            }
        }
    }).filter(x => x != undefined)
}

export const flatRoutes = async () => {
    const routes = join(__cwd, config.input, 'routes')
    const files = discoverRoutes(routes)

    // Load the route topic
    const topics = await Promise.all(files.map(async ({ key, path }) => {
        const module: ModuleInfo = await import(path)

        return {
            module, key, subject: `${config.namespace}.${key}`,
        }
    }))

    return topics
}