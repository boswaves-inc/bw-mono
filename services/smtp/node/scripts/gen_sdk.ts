import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createAuxiliaryTypeStore, ZodToTsOptions, printNode, zodToTs } from 'zod-to-ts';
import { toPascalCase, } from 'string-transform';
import { write } from '@boswaves-inc/codegen';
import { element } from '../src/components/utils'
import elements from '../src/components/elements'
import routes from '../src/routes'
import { factory } from 'typescript'
import { keyBy } from 'lodash';
import { Scope, VariableDeclarationKind } from 'ts-morph';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type AuxStore = ZodToTsOptions['auxiliaryTypeStore']
// const modules = import.meta.glob<ElementInfo>('./elements/*.tsx', { eager: true });

// const __jiti = createJiti(import.meta.url, {
//     debug: true,
//     jsx: true
// });

// const write = async (output: string, tx: (file: SourceFile) => Promise<void>) => {
//   const project = new Project();
//   const file = project.createSourceFile(output, '', { overwrite: true, });

//   await tx(file)

//   file.formatText({
//     indentSize: 2,
//     convertTabsToSpaces: true,
//     semicolons: ts.SemicolonPreference.Insert
//   });

//   // Normalize any existing double newlines first
//   file.replaceWithText(file.getFullText().replace(/\n{2,}/g, '\n'));

//   // Add blank lines between top-level declarations (excluding imports)
//   const declarations = [
//     ...file.getTypeAliases(),
//     ...file.getInterfaces(),
//     ...file.getClasses(),
//     ...file.getFunctions(),
//     ...file.getVariableStatements(),
//   ].sort((a, b) => b.getStart() - a.getStart());

//   for (const decl of declarations) {
//     decl.appendWhitespace('\n');
//   }

//   // Add blank line after last import
//   const imports = file.getImportDeclarations();
//   if (imports.length > 0) {
//     imports[imports.length - 1].appendWhitespace('\n');
//   }

//   // Add blank lines between class members (excluding properties)
//   for (const cls of file.getClasses()) {
//     const properties = cls.getProperties();
//     const methods = [
//       ...cls.getConstructors(),
//       ...cls.getMethods(),
//     ].sort((a, b) => b.getStart() - a.getStart());

//     // Add blank line after last property (before constructor/methods)
//     if (properties.length > 0) {
//       properties[properties.length - 1].appendWhitespace('\n');
//     }

//     // Add blank lines between constructors and methods
//     for (const member of methods) {
//       member.appendWhitespace('\n');
//     }
//   }

//   file.insertText(0, '// AUTO-GENERATED - DO NOT EDIT\n\n');

//   await file.save();
// }

// const gen_kafka_elements = async () => {
//   const output = join(__dirname, '../../sdk/src/kafka/elements.ts');
//   const store = createAuxiliaryTypeStore()

//   await write(output, async file => {
//     const map = await loadElementMap()
//     const types = Object.keys(map)

//     file.addTypeAlias({
//       isExported: true,
//       name: 'Primitive',
//       type: `string | number`
//     });

//     for (const type in map) {
//       const module = map[type]

//       if (module.schema) {
//         const { node } = zodToTs(module.schema, {
//           auxiliaryTypeStore: store
//         })

//         file.addTypeAlias({
//           isExported: true,
//           name: toPascalCase(`${type}Props`),
//           type: printNode(node),
//         });
//       }
//     }

//     file.addTypeAlias({
//       isExported: true,
//       name: 'ElementPropsMap',
//       type: `{\n${types.map(t => `  '${t}': ${toPascalCase(`${t}Props`)},`).join('\n')}\n}`
//     });

//     file.addTypeAlias({
//       isExported: true,
//       name: 'ElementType',
//       type: 'keyof ElementPropsMap',
//     });

//     file.addTypeAlias({
//       isExported: true,
//       name: 'Element',
//       type: `{\n[T in ElementType]: ElementPropsMap[T] & { type: T,\ncontent: (Element | Primitive)[] | Element | Primitive\n}\n}[ElementType]`,
//     });
//   });
// }

const gen_kafka_routes = async () => {
    //   const output = join(__dirname, '../../sdk/src/kafka/routes.ts');
    //   const store = createAuxiliaryTypeStore()

    //   await write(output, async file => {
    //     const map = await loadRouteMap()
    //     const topics = Object.keys(map)

    //     file.addImportDeclaration({
    //       namedImports: [
    //         'Primitive',
    //         'Element'
    //       ],
    //       isTypeOnly: true,
    //       moduleSpecifier: './elements'
    //     })

    //     file.addVariableStatement({
    //       declarationKind: VariableDeclarationKind.Const,
    //       isExported: true,
    //       declarations: [{
    //         name: 'TOPICS',
    //         initializer: `[\n${topics.map(t => `  '${t}',`).join('\n')}\n] as const`,
    //       }],
    //     });

    //     for (const topic in map) {
    //       const { module, key } = map[topic]
    //       const { node } = zodToTs(module.schema, {
    //         auxiliaryTypeStore: store,
    //       })

    //       file.addTypeAlias({
    //         isExported: true,
    //         name: toPascalCase(`${key}_args`),
    //         type: `${printNode(node)} & { content: (Element | Primitive)[] | Element | Primitive }`,
    //       });
    //     }

    //     file.addTypeAlias({
    //       isExported: true,
    //       name: 'TopicArgsMap',
    //       type: `{\n${topics.map(t => `  '${t}': ${toPascalCase(`${map[t].key}Args`)},`).join('\n')}\n}`
    //     });

    //     file.addTypeAlias({
    //       isExported: true,
    //       name: 'Topic',
    //       type: '(typeof TOPICS)[number]',
    //     });

    //     file.addTypeAlias({
    //       isExported: true,
    //       name: 'TopicArgs<T extends Topic>',
    //       type: 'TopicArgsMap[T]',
    //     });

    //   })
}

// const gen_kafka_index = async () => {
//   const output = join(__dirname, '../../sdk/src/kafka/index.ts');

//   await write(output, async file => {
//     const map = await loadRouteMap()
//     const topics = Object.keys(map)

//     file.addImportDeclaration({
//       namedImports: [
//         'CompressionTypes',
//         'Kafka',
//         'KafkaConfig',
//         'Message',
//         'Partitioners',
//         'Producer'
//       ],
//       moduleSpecifier: 'kafkajs'
//     })

//     file.addImportDeclaration({
//       namedImports: ['Topic', ...topics.map(t => toPascalCase(`${map[t].key}Args`))],
//       isTypeOnly: true,
//       moduleSpecifier: './routes'
//     })

//     file.addClass({
//       isExported: true,
//       name: 'Smtp',
//       properties: [{
//         name: '_producer',
//         type: 'Producer',
//         scope: Scope.Private,
//       }],
//       ctors: [{
//         scope: Scope.Private,
//         parameters: [{ name: 'producer', type: 'Producer' }],
//         statements: 'this._producer = producer;'
//       }],
//       methods: [

//         {
//           name: '_send',
//           scope: Scope.Private,
//           isAsync: true,
//           parameters: [
//             { name: 'topic', type: 'Topic' },
//             { name: 'input', type: 'Message | Message[]' }
//           ],
//           statements: `
//             const messages = Array.isArray(input) ? input : [input];
//             return await this._producer.send({
//               topic,
//               messages,
//               compression: CompressionTypes.None,
//             });
//           `.trim()
//         },
//         ...topics.map(topic => {
//           const { key } = map[topic]
//           const argsType = toPascalCase(`${key}_args`)

//           return {
//             name: _.camelCase(key),
//             scope: Scope.Public,
//             isAsync: true,
//             parameters: [{ name: 'body', type: argsType }],
//             statements: `
//               return await this._send('${topic}', {
//                 value: JSON.stringify(body)
//               });
//             `.trim()
//           }
//         }),
//         {
//           name: 'connect',
//           scope: Scope.Public,
//           isStatic: true,
//           isAsync: true,
//           parameters: [
//             {
//               name: `{ clientId = '@boswaves-inc/smtp-sdk', ...config }`,
//               type: 'KafkaConfig'
//             }
//           ],
//           returnType: 'Promise<Smtp>',
//           statements: `
//             const client = new Kafka({ ...config, clientId });
//             const producer = client.producer({
//               createPartitioner: Partitioners.DefaultPartitioner,
//               allowAutoTopicCreation: false
//             });

//             await producer.connect();

//             return new Smtp(producer);
//           `.trim()
//         },
//       ]
//     })
//   })
// }


const gen_elements = async (store: AuxStore) => {
    const output = join(__dirname, '../../sdk/src/nats/elements.ts');

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
    const output = join(__dirname, '../../sdk/src/nats/routes.ts');

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
            name: 'Topic',
            type: `${Array.from(nodes).map(({ subject }) => `'${subject}'`).join(' | ')}`
        });

        return nodes
    })

}

const run = async () => {
    const output = join(__dirname, '../../sdk/src/nats/index.ts');
    const store = createAuxiliaryTypeStore()

    const elements = await gen_elements(store)
    const routes = await gen_routes(store, elements)

    await write(output, async ({ file }) => {
        file.addImportDeclaration({
            isTypeOnly: true,
            namedImports: ['Topic', ...routes.map(({ key }) => toPascalCase(`${key}_args`))],
            moduleSpecifier: './routes'
        })

        file.addClass({
            isExported: true,
            name: 'Smtp',
            // properties: [{
            //     name: '_producer',
            //     type: 'Producer',
            //     scope: Scope.Private,
            // }],
            // ctors: [{
            //     scope: Scope.Private,
            //     parameters: [{ name: 'producer', type: 'Producer' }],
            //     statements: 'this._producer = producer;'
            // }],
            methods: [

                // {
                //     name: '_send',
                //     scope: Scope.Private,
                //     isAsync: true,
                //     parameters: [
                //         { name: 'topic', type: 'Topic' },
                //         { name: 'input', type: 'Message | Message[]' }
                //     ],
                //     statements: `
                //         const messages = Array.isArray(input) ? input : [input];
                //         return await this._producer.send({
                //         topic,
                //         messages,
                //         compression: CompressionTypes.None,
                //         });
                //     `.trim()
                // },
                // ...topics.map(topic => {
                //     const { key } = map[topic]
                //     const argsType = toPascalCase(`${key}_args`)

                //     return {
                //         name: _.camelCase(key),
                //         scope: Scope.Public,
                //         isAsync: true,
                //         parameters: [{ name: 'body', type: argsType }],
                //         statements: `
                //             return await this._send('${topic}', {
                //                 value: JSON.stringify(body)
                //             });
                //         `.trim()
                //     }
                // }),
                // {
                //     name: 'connect',
                //     scope: Scope.Public,
                //     isStatic: true,
                //     isAsync: true,
                //     parameters: [
                //         {
                //             name: `{ clientId = '@boswaves-inc/smtp-sdk', ...config }`,
                //             type: 'KafkaConfig'
                //         }
                //     ],
                //     returnType: 'Promise<Smtp>',
                //     statements: `
                //         const client = new Kafka({ ...config, clientId });
                //         const producer = client.producer({
                //             createPartitioner: Partitioners.DefaultPartitioner,
                //             allowAutoTopicCreation: false
                //         });

                //         await producer.connect();

                //         return new Smtp(producer);
                //     `.trim()
                // },
            ]
        })
    })

    //   await gen_kafka_elements()
    //   await gen_kafka_routes()
    //   await gen_kafka_index()
}

run()