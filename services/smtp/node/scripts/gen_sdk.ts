import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createAuxiliaryTypeStore } from 'zod-to-ts';
// import { Project, Scope, SourceFile, VariableDeclarationKind, ts } from 'ts-morph';
// import { createAuxiliaryTypeStore, printNode, zodToTs } from 'zod-to-ts';
// import { toPascalCase, } from 'string-transform';
// import { loadElementMap, loadRouteMap } from '../src/loader';
// import * as _ from 'lodash-es';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// const gen_kafka_routes = async () => {
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
// }

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

const elements = () => {
    const output = join(__dirname, '../../sdk/src/kafka/elements.ts');
    const store = createAuxiliaryTypeStore()

    // const { node } = zodToTs(z.array(element()), {
    //     auxiliaryTypeStore: store
    // })
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
}

const run = async () => {
    //   await gen_kafka_elements()
    //   await gen_kafka_routes()
    //   await gen_kafka_index()
}

run()