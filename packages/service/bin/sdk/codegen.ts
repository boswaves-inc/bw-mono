import { write } from '@boswaves-inc/codegen';
import { join } from 'path';
import { Scope } from 'ts-morph';
import { toCamelCase, toPascalCase, toSnakeCase } from 'string-transform';
import { routes, config } from 'virtual:svc/server-build'
import { createAuxiliaryTypeStore, printNode, zodToTs } from 'zod-to-ts';
import type { SvcBuildContext } from '../../src/types';

const __cwd = process.cwd();

const gen_routes = async ({ store, remap, imports }: SvcBuildContext) => {
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
            name: 'SvcConfig',
            type: `ConnectionOptions & { 
                jetstream?: JetStreamOptions; 
            }`
        })
    })

    await write(join(__cwd, config.output, 'client.ts'), async ({ file }) => {
        file.addImportDeclaration({
            namedImports: [
                'Codec',
                'NatsConnection',
                'RequestOptions',
                'JetStreamClient',
                'JSONCodec',
            ],
            moduleSpecifier: 'nats'
        })

        file.addImportDeclaration({
            isTypeOnly: true,
            namedImports: ['Subject'],
            moduleSpecifier: './routes'
        })

        file.addClass({
            name: 'SvcClient<Sub extends string = Subject>',
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
                    scope: Scope.Protected,
                },
                {
                    name: '_jetstream',
                    type: 'JetStreamClient',
                    scope: Scope.Protected,
                }
            ],
            ctors: [{
                scope: Scope.Protected,
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
                    scope: Scope.Protected,
                    isAsync: true,
                    parameters: [
                        { name: 'topic', type: 'Sub' },
                        { name: 'body', type: 'T' },
                        { name: 'opts?', type: 'RequestOptions' }
                    ],
                    statements: [
                        'const payload = this._codec.encode(body)',
                        'await this._connection.request(topic, payload, opts)'
                    ]
                },
            ]
        })
    })

    await write(join(__cwd, config.output, 'index.ts'), async ({ file }) => {
        type RouteNode = {
            routes: typeof routes,
            children: Map<string, RouteNode>
        }

        const name = toPascalCase(config.namespace)

        const tree = routes.reduce<RouteNode>((tree, route) => {
            const parts = route.subject.split('.')
            const segments = parts.slice(1, -1) // Everything between namespace and action

            // Navigate/create tree path
            const leaf = segments.reduce<RouteNode>((current, segment, index) => {
                if (!current.children.has(segment)) {
                    current.children.set(segment, { routes: [], children: new Map() })
                }

                const next = current.children.get(segment)!

                // If this is the last segment, add the route
                if (index === segments.length - 1) {
                    next.routes.push(route)
                }

                return next
            }, tree)

            return tree
        }, { routes: [], children: new Map() })

        const generate = (node: RouteNode, path = new Array<string>(), root = false) => {
            const subname = root ? name : `${name}$${path.map(toPascalCase).join('$')}`
            const leafs = node.routes.length > 0

            if (leafs || node.children.size > 0) {
                file.addClass({
                    name: subname,
                    isExported: root,
                    extends: leafs ? `SvcClient<\`${config.namespace}.${path.join('.')}.\${string}\`>` : 'SvcClient',
                    methods: [
                        ...node.routes.map(({ key, subject }) => ({
                            name: toCamelCase(key.split('.').at(-1)!),
                            scope: Scope.Public,
                            isAsync: true,
                            parameters: [
                                { name: 'body', type: toPascalCase(`${key}_args`) },
                                { name: 'opts?', type: 'RequestOptions' },
                            ],
                            statements: [
                                `return await this._request('${subject}', body, opts)`
                            ]
                        })),
                        ...(root ? [{
                            name: 'connect',
                            scope: Scope.Public,
                            isStatic: true,
                            isAsync: true,
                            parameters: [{ name: `{ jetstream, ...args }`, type: 'SvcConfig' }],
                            statements: [
                                'const connection = await connect({ ...args })',
                                'const stream = connection.jetstream(jetstream)',
                                `return new ${name}(connection, stream)`
                            ],
                            returnType: `Promise<${name}>`,
                        }] : [])
                    ],
                    getAccessors: Array.from(node.children.keys()).map(key => ({
                        name: toCamelCase(key),
                        scope: Scope.Public,
                        returnType: `${name}$${[...path, key].map(toPascalCase).join('$')}`,
                        statements: `return new ${name}$${[...path, key].map(toPascalCase).join('$')}(this._connection, this._jetstream)`
                    }))
                })

                // Use forEach for side effects (recursive generation)
                node.children.forEach((node, key) => {
                    generate(node, [...path, key], false)
                })
            }
        }

        file.addImportDeclaration({
            namedImports: [
                'connect',
                'RequestOptions'
            ],
            moduleSpecifier: 'nats'
        })

        file.addImportDeclaration({
            namedImports: ['SvcConfig'],
            moduleSpecifier: './types'
        })

        file.addImportDeclaration({
            namedImports: ['SvcClient'],
            moduleSpecifier: './client'
        })

        file.addImportDeclarations(routes.map(({ key }) => ({
            namedImports: [toPascalCase(`${key}_args`)],
            moduleSpecifier: './routes'
        })))

        generate(tree, [], true)

    })
}

run()