import { fileURLToPath, pathToFileURL } from 'url';
import { join, dirname } from 'path';
import { existsSync, readdirSync } from 'fs';
import { RouteMap, RouteModule, RouteTopic } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __ext = /\.(ts|tsx|js|jsx)$/;

const parse = (dir: string) => readdirSync(dir)
    .filter((file) => __ext.test(file))
    .filter((file) => !file.startsWith('_'))
    .map<RouteTopic>(file => ({
        topic: `smtp.${file.replace(__ext, "")}`,
        key: file.replace(__ext, ""),
        path: file
    }))

export const load = async (dir: string) => {
    return await Promise.all(parse(dir).map<Promise<[string, RouteMap['']]>>(async ({ topic, key, path }) => {
        const file = join(dir, path)
        const module: RouteModule = await import(pathToFileURL(file).href)

        if (module.schema == undefined) {
            throw new Error(`schema not exported from route: ${file}`)
        }

        if (module.default == undefined) {
            throw new Error(`handler not exported from route: ${file}`)
        }

        return [topic, { module, key }]
    })).then(entries => entries.reduce<RouteMap>((prev, [topic, module]) => ({
        ...prev, [topic]: module
    }), {}));
}

export default async () => {
    const root = join(__dirname, 'routes');

    if (!existsSync(root)) {
        throw new Error(`Routes directory not found: ${root}`);
    }

    return await load(root)
}

