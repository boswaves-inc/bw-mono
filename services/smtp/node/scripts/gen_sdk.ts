import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createAuxiliaryTypeStore, ZodToTsOptions, printNode, zodToTs } from 'zod-to-ts';
import { toCamelCase, toPascalCase, } from 'string-transform';
import { write } from '@boswaves-inc/codegen';
import { element } from '../src/components/utils'
import elements from '../src/components/elements'
import routes from '../src/routes'
import { factory } from 'typescript'
import { Scope } from 'ts-morph';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type AuxStore = ZodToTsOptions['auxiliaryTypeStore']

const gen_elements = async (store: AuxStore) => {
    const output = join(__dirname, '../../sdk/src/elements.ts');

    return await write(output, async ({ file }) => {
        elements.forEach(({ key }) => {
            const schema = element(key)

            zodToTs(schema, { auxiliaryTypeStore: store })
        })

        elements.forEach(({ key }) => {
            const schema = element(key)
            const ref = store.definitions.get(schema)

            if (ref == undefined) {
                const result = zodToTs(schema, { auxiliaryTypeStore: store })

                const identifier = factory.createIdentifier(toPascalCase(`${key}_props`))
                const node = factory.createTypeAliasDeclaration(undefined, identifier, undefined, result.node)

                store.definitions.set(schema, { identifier, node })
            }
        })

        const keys = elements.map(({ key }) => key)

        const aux = elements.reduce((prev, { key }) => {
            const schema = element(key)
            const def = store.definitions.get(schema)

            if (def && 'identifier' in def) {
                const oldName = printNode(def.identifier)

                if (oldName.startsWith('Auxiliary_')) {
                    prev.set(oldName, toPascalCase(`${key}_props`))
                }
            }

            return prev
        }, new Map<string, string>())

        const inlines = Array.from(store.definitions).reduce((prev, [_, { node, identifier }]) => {
            const name = printNode(identifier)

            if (!name.startsWith('Auxiliary_')) {
                const match = printNode(node).match(/^type \w+ = (.+);$/s).at(1)

                if (match != undefined) {
                    prev.set(match.trim(), name)
                }
            }
            return prev
        }, new Map<string, string>())

        Array.from(store.definitions.values()).forEach(({ identifier, node }) => {
            const ident = printNode(identifier)

            const code = Array.from(aux).reduce((prev, [old_, new_]) => (
                prev.replace(new RegExp(`\\b${old_}\\b`, 'g'), new_)
            ), printNode(node));

            const format = Array.from(inlines).reduce((prev, [body, name]) => {
                if (name !== ident && aux.get(ident ?? '') !== name) {
                    const needle = body.replace(/\s+/g, ' ')
                    const norm = prev.replace(/\s+/g, ' ')

                    if (norm.includes(needle)) {
                        return prev.replace(new RegExp(
                            body.replace(/[{}()\[\]|.?*+^$\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'g'
                        ), name)
                    }
                }

                return prev
            }, code)

            const regex = format.match(/^type (\w+) = (.+);$/s)

            if (regex) {
                const [_, name, type] = regex

                file.addTypeAlias({
                    type,
                    name,
                    isExported: true,
                })
            }
        })

        return { keys, aux }
    })
}

const gen_routes = async (store: AuxStore, elements: { keys: string[], aux: Map<string, string> }) => {
    const output = join(__dirname, '../../sdk/src/routes.ts');

    return await write(output, async ({ file }) => {
        file.addImportDeclaration({
            isTypeOnly: true,
            namedImports: elements.keys.map(x => toPascalCase(`${x}_props`)),
            moduleSpecifier: './elements'
        })

        const nodes = await Promise.all(routes.map(async ({ module, ...args }) => {
            const meta = module.meta({})
            const schema = await module.schema({ meta })
            const { node } = zodToTs(schema, { auxiliaryTypeStore: store })

            return { node, ...args }
        }))

        Array.from(nodes).forEach(({ node, key }) => {
            const name = toPascalCase(`${key}_args`)
            const type = Array.from(elements.aux).reduce((prev, [old_, new_]) => (
                prev.replace(new RegExp(`\\b${old_}\\b`, 'g'), new_)
            ), printNode(node));

            file.addTypeAlias({
                type,
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
    const output = join(__dirname, '../../sdk/src/index.ts');
    const store = createAuxiliaryTypeStore()

    const elements = await gen_elements(store)
    const routes = await gen_routes(store, elements)

    await write(output, async ({ file }) => {
        file.addImportDeclaration({
            namedImports: [
                'NatsConnection',
                'RequestOptions',
                'Payload',
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

run()