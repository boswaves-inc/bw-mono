#!/usr/bin/env vite-node

import { Scope } from "ts-morph"
import { write } from "@boswaves-inc/codegen"
import { toCamelCase, toPascalCase } from 'string-transform'
import type { ZodToTsOptions } from 'zod-to-ts'

type AuxStore = ZodToTsOptions['auxiliaryTypeStore']

const routes = async <T extends { key: string, subject: string }>(output: string, routes: T[]) => {
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

const client = async <T extends { key: string, subject: string }>(output: string, routes: T[]) => {
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