#!/usr/bin/env tsx

import { ViteNodeRunner } from 'vite-node/client'
import { ViteNodeServer } from 'vite-node/server'
import { installSourcemapsSupport } from 'vite-node/source-map'

import { Scope } from "ts-morph"
import { write } from "@boswaves-inc/codegen"
import { toCamelCase, toPascalCase } from 'string-transform'
import { createAuxiliaryTypeStore, type ZodToTsOptions } from 'zod-to-ts'
import { dirname, join, resolve } from "path"
import { readdirSync } from "fs"
import { fileURLToPath, pathToFileURL } from "url"
import type { ModuleInfo, NatsConfig } from "../src/types"
import { createServer } from "vite"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type AuxStore = ZodToTsOptions['auxiliaryTypeStore']


const gen_routes = async (module: string, store: AuxStore, elements: { keys: string[], aux: Map<string, string> }) => {
    const output = join(__dirname, '../../sdk/src/routes.ts');

    return await write(output, async ({ file }) => {
        //     file.addImportDeclaration({
        //         isTypeOnly: true,
        //         namedImports: elements.keys.map(x => toPascalCase(`${x}_props`)),
        //         moduleSpecifier: './elements'
        //     })

        // const nodes = await Promise.all(routes.map(async ({ module, ...args }) => {
        //     const meta = module.meta({})
        //     const schema = await module.schema({ meta })
        //     const { node } = zodToTs(schema, { auxiliaryTypeStore: store })

        //     return { node, ...args }
        // }))

        //     Array.from(nodes).forEach(({ node, key }) => {
        //         const name = toPascalCase(`${key}_args`)
        //         const type = Array.from(elements.aux).reduce((prev, [old_, new_]) => (
        //             prev.replace(new RegExp(`\\b${old_}\\b`, 'g'), new_)
        //         ), printNode(node));

        //         file.addTypeAlias({
        //             type,
        //             name,
        //             isExported: true,
        //         })
        //     })

        //     file.addTypeAlias({
        //         isExported: true,
        //         name: 'Subject',
        //         type: `${Array.from(nodes).map(({ subject }) => `'${subject}'`).join(' | ')}`
        //     });

        // return nodes
    })

}


const gen_client = async <T extends { key: string, subject: string }>(output: string, routes: T[]) => {
    await write(output, async ({ file }) => {
        file.addImportDeclaration({
            namedImports: [
                'NatsConnection',
                'RequestOptions',
                'ConnectionOptions',
                'connect as natsConnect',
                'JetStreamOptions',
                'JetStreamClient'
            ],
            moduleSpecifier: 'nats'
        })

        file.addImportDeclaration({
            isTypeOnly: true,
            namedImports: ['Subject', ...routes.map(({ key }) => toPascalCase(`${key}_args`))],
            moduleSpecifier: './routes'
        })

        file.addClass({
            isExported: true,
            name: 'Smtp',
            properties: [
                {
                    name: '_connection',
                    type: 'NatsConnection',
                    scope: Scope.Private,
                },
                {
                    name: '_jetstream',
                    type: 'JetStreamClient',
                    scope: Scope.Private,
                }
            ],
            ctors: [{
                scope: Scope.Private,
                parameters: [
                    {
                        name: 'connection',
                        type: 'NatsConnection'
                    },
                    {
                        name: 'jetsream',
                        type: 'JetStreamClient'
                    }
                ],
                statements: [
                    'this._connection = connection;',
                    'this._jetstream = jetsream;'
                ]
            }],
            methods: [
                {
                    name: '_request<T>',
                    scope: Scope.Private,
                    isAsync: true,
                    parameters: [
                        { name: 'topic', type: 'Subject' },
                        { name: 'body', type: 'T' },
                        { name: 'opts?', type: 'RequestOptions' }
                    ],
                    statements: 'await this._connection.request(topic, JSON.stringify(body), opts)'
                },
                ...routes.map(({ key, subject }) => {
                    const argsType = toPascalCase(`${key}_args`)

                    return {
                        name: toCamelCase(key),
                        scope: Scope.Public,
                        isAsync: true,
                        parameters: [
                            { name: 'body', type: argsType },
                            { name: 'opts?', type: 'RequestOptions' }
                        ],
                        statements: `
                            return await this._request('${subject}', body, opts);
                        `.trim()
                    }
                }),
                {
                    name: 'connect',
                    scope: Scope.Public,
                    isStatic: true,
                    isAsync: true,
                    parameters: [
                        {
                            name: `{ jetstream, ...args }`,
                            type: ' ConnectionOptions & { jetstream?: JetStreamOptions }'
                        }
                    ],
                    statements: `
                        const connection = await natsConnect(args)
                        const stream = connection.jetstream(jetstream)

                        return new Smtp(connection, stream)
                    `.trim(),
                    returnType: 'Promise<Smtp>',
                },
            ]
        })
    })
}

const run = async () => {
    const server = await createServer({
        logLevel: 'error',
        server: {
            hmr: false,
            preTransformRequests: false
        },
        optimizeDeps: {
            exclude: ['@boswaves-inc/*']
        }
    })

    await server.pluginContainer.buildStart()
    const node = new ViteNodeServer(server)

    installSourcemapsSupport({
        getSourceMap: (source) => node.getSourceMap(source),
    })

    const client = new ViteNodeRunner({
        root: server.config.root,
        fetchModule(id) {
            return node.fetchModule(id)
        },
        resolveId(id, importer) {
            return node.resolveId(id, importer)
        },
    })

    await client.executeFile(resolve(__dirname, './codegen.ts'))
    await server.close()
}

run()