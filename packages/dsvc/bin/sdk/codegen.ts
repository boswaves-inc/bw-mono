import { write } from '@boswaves-inc/codegen';
import { join } from 'path';
import { Scope } from 'ts-morph';
import { toCamelCase, toPascalCase } from 'string-transform';
import { routes, config } from 'virtual:dsvc/server-build'
import { createAuxiliaryTypeStore, printNode, zodToTs } from 'zod-to-ts';
import type { DsvcBuildContext } from '../../src/types';

const __cwd = process.cwd();

const gen_routes = async ({ store, remap, imports }: DsvcBuildContext) => {
    const output = join(__cwd, config.output, 'routes.ts');

    await write(output, async ({ file }) => {
        imports.forEach(({ module, statements }) => {
            file.addImportDeclaration({
                namedImports: statements,
                moduleSpecifier: `./${module}`
            })
        })

        const nodes = await Promise.all(routes.map(async ({ module, ...args }) => {
            const meta = module.meta?.({})
            const schema = await module.schema({ meta })

            const { node } = zodToTs(schema, { auxiliaryTypeStore: store })

            return { node, ...args }
        }))

        Array.from(nodes).forEach(({ node, key }) => {
            const name = toPascalCase(`${key}_args`)
            const type = Array.from(remap).reduce((prev, [old_, new_]) => (
                prev.replace(new RegExp(`\\b${old_}\\b`, 'g'), new_)
            ), printNode(node));

            file.addTypeAlias({ type, name, isExported: true })
        })

        file.addTypeAlias({
            isExported: true,
            name: 'Subject',
            type: `${Array.from(nodes).map(({ subject }) => `'${subject}'`).join(' | ')}`
        });
    })
}

const run = async () => {
    const store = createAuxiliaryTypeStore()
    const remap = new Map()
    const imports = new Array<{ module: string, statements: string[] }>

    await config.build?.({
        store,
        remap,
        imports,
        write: (output, tx) => write(join(__cwd, config.output, output), tx)
    })

    await gen_routes({
        store,
        remap,
        imports
    })

    await write(join(__cwd, config.output, 'types.ts'), async ({ file }) => {
        file.addImportDeclaration({
            namedImports: [
                'ConnectionOptions',
                'JetStreamOptions',
            ],
            moduleSpecifier: 'nats'
        })

        file.addTypeAlias({
            isExported: true,
            name: 'DsvcConfig',
            type: `ConnectionOptions & { 
                jetstream?: JetStreamOptions; 
            }`
        })
    })

    await write(join(__cwd, config.output, 'index.ts'), async ({ file }) => {
        const name = toPascalCase(config.namespace)

        file.addImportDeclaration({
            namedImports: [
                'Codec',
                'NatsConnection',
                'RequestOptions',
                'JetStreamClient',
                'JSONCodec',
                'connect',
            ],
            moduleSpecifier: 'nats'
        })

        file.addImportDeclaration({
            isTypeOnly: true,
            namedImports: ['Subject', ...routes.map(({ key }) => toPascalCase(`${key}_args`))],
            moduleSpecifier: './routes'
        })

        file.addImportDeclaration({
            isTypeOnly: true,
            namedImports: ['DsvcConfig'],
            moduleSpecifier: './types'
        })

        file.addClass({
            name,
            isExported: true,
            properties: [
                {
                    name: '_codec',
                    type: 'Codec<unknown>',
                    scope: Scope.Private,
                },
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
                    'this._codec = JSONCodec();',
                    'this._jetstream = jetsream;',
                    'this._connection = connection;',
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
                    statements: [
                        'const payload = this._codec.encode(body)',
                        'await this._connection.request(topic, payload, opts)'
                    ]
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
                        statements: `return await this._request('${subject}', body, opts)`
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
                            type: 'DsvcConfig'
                        }
                    ],
                    statements: [
                        'const connection = await connect({ ...args })',
                        'const stream = connection.jetstream(jetstream)',
                        `return new ${name}(connection, stream)`
                    ],
                    returnType: `Promise<${name}>`,
                },
            ]
        })
    })
}

run()