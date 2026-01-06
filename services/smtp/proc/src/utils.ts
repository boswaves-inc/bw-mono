import { createHash } from "crypto"
import { render as renderTemplate, toPlainText } from '@react-email/components';
import { ReactNode } from "react";
import { formData } from 'zod-form-data'
import z, { ZodType } from "zod/v4";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { existsSync, readdirSync } from "fs";
import { BlockMap, BlockModule, BlockType, RouteMap, RouteModule, RouteTopic } from "./types";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const idempotency_key = <T>(body: T) => {
    return createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0, 32)
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __ext = /\.(ts|tsx|js|jsx)$/;

type Renderer<T extends z.ZodType> = (data: z.output<T>) => ReactNode

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const template = <T extends ZodType>(name: string, shape: T, render: Renderer<T>) => {
    const handler = (data: unknown) => formData(shape).parseAsync(data).then(async x => {
        const html = await renderTemplate(render(x))
        const text = toPlainText(html)

        return { html, text, default: html }
    }).catch(err => {
        throw err
    })

    return { name, handler, render }
}

export const loadRouteMap = async () => {
    const root = join(__dirname, 'routes')

    if (!existsSync(root)) {
        throw new Error(`Routes directory not found: ${root}`);
    }

    const topics = readdirSync(root)
        .filter((file) => __ext.test(file))
        .filter((file) => !file.startsWith('_'))
        .map<RouteTopic>(file => ({
            topic: `smtp.${file.replace(__ext, "")}`,
            key: file.replace(__ext, ""),
            path: file
        }))

    const entries = await Promise.all(topics.map<Promise<[string, RouteMap['']]>>(async ({ topic, key, path }) => {
        const file = join(root, path)
        const module: RouteModule = await import(pathToFileURL(file).href)

        if (module.schema == undefined) {
            throw new Error(`schema not exported from route: ${file}`)
        }

        if (module.default == undefined) {
            throw new Error(`handler not exported from route: ${file}`)
        }

        return [
            topic,
            {
                key,
                module: {
                    ...module,
                    schema: module.schema.extend({
                        content: z.any()
                    })
                }
            }
        ]
    }));

    return entries.reduce<RouteMap>((prev, [topic, module]) => ({
        ...prev, [topic]: module
    }), {});
}

export const loadBlockMap = async () => {
    const root = join(__dirname, 'components/blocks')

    if (!existsSync(root)) {
        throw new Error(`Routes directory not found: ${root}`);
    }

    const blocks = readdirSync(root)
        .filter((file) => __ext.test(file))
        .filter((file) => !file.startsWith('_'))
        .map<BlockType>(file => ({
            key: file.replace(__ext, ""),
            path: file
        }))

    return await Promise.all(blocks.map<Promise<[string, BlockModule]>>(async ({ key, path }) => {
        const file = join(root, path)
        const module: BlockModule = await import(pathToFileURL(file).href)

        if (module.schema != undefined) {
            if (module.schema.type !== 'object') {
                throw new Error(`schema has to be typeof ZodObject: ${file}`)
            }

            return [
                key,
                {
                    schema: module.schema.extend({

                    })
                }
            ]
        }

        // if (module.default == undefined) {
        //     throw new Error(`handler not exported from route: ${file}`)
        // }

        return [
            key,
            {
                schema: z.object({

                })
            }
        ]
    })).then(entries => entries.reduce<BlockMap>((prev, [topic, module]) => ({
        ...prev, [topic]: module
    }), {}));
}