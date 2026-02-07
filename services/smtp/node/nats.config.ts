import { defineConfig } from "@boswaves-inc/nats-router/config";
import { printNode, zodToTs } from 'zod-to-ts';
import { toPascalCase, } from 'string-transform';
import { factory } from 'typescript'

export default defineConfig({
    namespace: 'smtp',
    routes: './src',
    types: '.nats-router',
    sdk: {
        name: 'Smtp',
        out: '../sdk/src',
        pkg: '@boswaves-inc/smtp-sdk',
        build: async ({ store, remap, imports, write }) => {
            const { default: elements } = await import('./src/components/elements')
            const { element } = await import('./src/components/utils.ts')

            await write('elements.ts', async ({ file }) => {
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

                elements.forEach(({ key }) => {
                    const schema = element(key)
                    const def = store.definitions.get(schema)

                    if (def && 'identifier' in def) {
                        const oldName = printNode(def.identifier)

                        if (oldName.startsWith('Auxiliary_')) {
                            remap.set(oldName, toPascalCase(`${key}_props`))
                        }
                    }
                })

                const inlines = Array.from(store.definitions).reduce((prev, [_, { node, identifier }]) => {
                    const name = printNode(identifier)

                    if (!name.startsWith('Auxiliary_')) {
                        const match = printNode(node).match(/^type \w+ = (.+);$/s)?.at(1)

                        if (match != undefined) {
                            prev.set(match.trim(), name)
                        }
                    }
                    return prev
                }, new Map<string, string>())

                Array.from(store.definitions.values()).forEach(({ identifier, node }) => {
                    const ident = printNode(identifier)

                    const code = Array.from(remap).reduce((prev, [old_, new_]) => (
                        prev.replace(new RegExp(`\\b${old_}\\b`, 'g'), new_)
                    ), printNode(node));

                    const format = Array.from(inlines).reduce((prev, [body, name]) => {
                        if (name !== ident && remap.get(ident ?? '') !== name) {
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
            })

            imports.push({
                module: 'elements',
                statements: elements.map(({ key }) => toPascalCase(`${key}_props`))
            })
        }
    }
})