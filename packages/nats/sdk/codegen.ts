import { write } from '@boswaves-inc/codegen';
import { join } from 'path';
import { toCamelCase, toPascalCase } from 'string-transform';
import { Scope } from 'ts-morph';
import { routes, config } from 'virtual:nats-router/server-build'
import { createAuxiliaryTypeStore, printNode, zodToTs, type ZodToTsOptions } from 'zod-to-ts';

const __cwd = process.cwd();

const gen_routes = async (store: ZodToTsOptions['auxiliaryTypeStore']) => {
    const output = join(__cwd, config.sdk.out, 'nats', 'routes.ts');

    return await write(output, async ({ file }) => {
        // file.addImportDeclaration({
        //     isTypeOnly: true,
        //     namedImports: elements.keys.map(x => toPascalCase(`${x}_props`)),
        //     moduleSpecifier: './elements'
        // })

        const nodes = await Promise.all(routes.map(async ({ module, ...args }) => {
            const meta = module.meta?.({})
            const schema = await module.schema({ meta })

            const { node } = zodToTs(schema, { auxiliaryTypeStore: store })

            return { node, ...args }
        }))

        Array.from(nodes).forEach(({ node, key }) => {
            const name = toPascalCase(`${key}_args`)
            // const type = Array.from(elements.aux).reduce((prev, [old_, new_]) => (
            //     prev.replace(new RegExp(`\\b${old_}\\b`, 'g'), new_)
            // ), printNode(node));

            file.addTypeAlias({
                type: printNode(node),
                name,
                isExported: true,
            })
        })

        file.addTypeAlias({
            isExported: true,
            name: 'Subject',
            type: `${Array.from(nodes).map(({ subject }) => `'${subject}'`).join(' | ')}`
        });

        return nodes
    })
}

const run = async () => {
    const output = join(__cwd, config.sdk.out, 'nats', 'index.ts');
    const store = createAuxiliaryTypeStore()


    // const elements = await gen_elements(store)
    const routes = await gen_routes(store)

    await write(join(__cwd, config.sdk.out, 'nats', 'types.ts'), async ({ file }) => {
        file.addImportDeclaration({
            namedImports: [
                'ConnectionOptions',
                'JetStreamOptions',
            ],
            moduleSpecifier: 'nats'
        })

        file.addTypeAlias({
            isExported: true,
            name: 'NatsConfig',
            type: `ConnectionOptions & { 
                jetstream?: JetStreamOptions; 
            }`
        })
    })

    await write(join(__cwd, config.sdk.out, 'nats', 'index.ts'), async ({ file }) => {
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
            namedImports: ['NatsConfig'],
            moduleSpecifier: './types'
        })

        file.addClass({
            isExported: true,
            name: 'Smtp',
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
                            type: 'NatsConfig'
                        }
                    ],
                    statements: [
                        'const connection = await connect({ ...args })',
                        'const stream = connection.jetstream(jetstream)',
                        'return new Smtp(connection, stream)'
                    ],
                    returnType: 'Promise<Smtp>',
                },
            ]
        })
    })
}

run()

// const run = async () => {
//     const output = join(__dirname, '../../sdk/src/index.ts');
//     const store = createAuxiliaryTypeStore()

//     const elements = await gen_elements(store)
//     const routes = await gen_routes(store, elements)

//     await write(output, async ({ file }) => {
//         file.addImportDeclaration({
//             namedImports: [
//                 'NatsConnection',
//                 'RequestOptions',
//                 'Payload',
//                 'ConnectionOptions',
//                 'connect as natsConnect',
//                 'JetStreamOptions',
//                 'JetStreamClient'
//             ],
//             moduleSpecifier: 'nats'
//         })

//         file.addImportDeclaration({
//             isTypeOnly: true,
//             namedImports: ['Subject', ...routes.map(({ key }) => toPascalCase(`${key}_args`))],
//             moduleSpecifier: './routes'
//         })

//         file.addClass({
//             isExported: true,
//             name: 'Smtp',
//             properties: [
//                 {
//                     name: '_connection',
//                     type: 'NatsConnection',
//                     scope: Scope.Private,
//                 },
//                 {
//                     name: '_jetstream',
//                     type: 'JetStreamClient',
//                     scope: Scope.Private,
//                 }
//             ],
//             ctors: [{
//                 scope: Scope.Private,
//                 parameters: [
//                     {
//                         name: 'connection',
//                         type: 'NatsConnection'
//                     },
//                     {
//                         name: 'jetsream',
//                         type: 'JetStreamClient'
//                     }
//                 ],
//                 statements: [
//                     'this._connection = connection;',
//                     'this._jetstream = jetsream;'
//                 ]
//             }],
//             methods: [
//                 {
//                     name: '_request<T>',
//                     scope: Scope.Private,
//                     isAsync: true,
//                     parameters: [
//                         { name: 'topic', type: 'Subject' },
//                         { name: 'body', type: 'T' },
//                         { name: 'opts?', type: 'RequestOptions' }
//                     ],
//                     statements: 'await this._connection.request(topic, JSON.stringify(body), opts)'
//                 },
//                 ...routes.map(({ key, subject }) => {
//                     const argsType = toPascalCase(`${key}_args`)

//                     return {
//                         name: toCamelCase(key),
//                         scope: Scope.Public,
//                         isAsync: true,
//                         parameters: [
//                             { name: 'body', type: argsType },
//                             { name: 'opts?', type: 'RequestOptions' }
//                         ],
//                         statements: `
//                             return await this._request('${subject}', body, opts);
//                         `.trim()
//                     }
//                 }),
//                 {
//                     name: 'connect',
//                     scope: Scope.Public,
//                     isStatic: true,
//                     isAsync: true,
//                     parameters: [
//                         {
//                             name: `{ jetstream, ...args }`,
//                             type: ' ConnectionOptions & { jetstream?: JetStreamOptions }'
//                         }
//                     ],
//                     statements: `
//                         const connection = await natsConnect(args)
//                         const stream = connection.jetstream(jetstream)

//                         return new Smtp(connection, stream)
//                     `.trim(),
//                     returnType: 'Promise<Smtp>',
//                 },
//             ]
//         })
//     })
// }

// run()