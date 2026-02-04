// import { type Plugin } from 'vite';
// import { ModuleDeclarationKind } from 'ts-morph';
// import { write } from '@boswaves-inc/codegen';
// import { mkdirSync, readdirSync } from 'fs';
// import { join, relative } from 'path';
// import { __cwd, loadElements } from './utils';

// const __ext = /\.(ts|tsx|jsx|js|mjs|cjs)$/;

// const __primitives = ['string', 'boolean', 'number']
// const __types = join('.codegen', 'types')

// interface CodegenConfig {
//     elements: string
// }

// export const sdkPlugin = ({ elements }: CodegenConfig): Plugin => {
//     const elementsDir = join(__cwd, elements)

//     // const primitives = ['string', 'boolean', 'number']
//     // const types = join('.codegen', 'types')

//     return {
//         name: 'smtp/sdk',
//         enforce: 'pre',

//         //     config: () => {
//         //         return {
//         //             build: {
//         //                 rollupOptions: {
//         //                     external: ['perf_hooks'],
//         //                 },
//         //             },
//         //             ssr: {
//         //                 noExternal: ['@boswaves-inc/smtp'],
//         //             },
//         //         };
//         //     },

//         resolveId: (id) => {
//             if (id === "virtual:smtp/sdk") {
//                 return "\0virtual:smtp/sdk"
//             };
//         },

//         load: async (id) => {
//             if (id === "\0virtual:smtp/sdk") {
//                 return ``
//                 // return `export { default as elements, element_map } from "${elements.replace(/\\/g, '/')}";`
//             }
//         },

//         buildStart: async () => {
//             const elements = await loadElements(elementsDir)


//             //         if (subjects.length > 0) {
//             //             mkdirSync(types, { recursive: true })

//             //             // Generate the main elements file
//             //             await write(join(types, '+elements.ts'), async file => {
//             //                 file.addImportDeclaration({
//             //                     isTypeOnly: true,
//             //                     moduleSpecifier: 'zod/v4',
//             //                     defaultImport: 'z',
//             //                 });

//             //                 file.addTypeAlias({
//             //                     name: 'ElementModules',
//             //                     type: `{\n
//             //                         ${subjects.map(({ rel, key }) => `
//             //                             '${key}': typeof import('${rel}')
//             //                         `).join('\n')}\n
//             //                     }`
//             //                 })

//             //                 file.addTypeAlias({
//             //                     name: 'PrimitiveMap',
//             //                     type: `{
//             //                         ${primitives.map(x => `${x}: ${x};`).join('\n')}
//             //                     }`
//             //                 })

//             //                 file.addTypeAlias({
//             //                     name: 'PrimitiveType',
//             //                     type: `keyof PrimitiveMap`
//             //                 })

//             //                 file.addTypeAlias({
//             //                     name: 'Primitive',
//             //                     type: `PrimitiveMap[PrimitiveType]`
//             //                 })

//             //                 file.addTypeAlias({
//             //                     name: 'ElementType',
//             //                     type: `keyof ElementModules`
//             //                 })

//             //                 file.addTypeAlias({
//             //                     name: 'Element',
//             //                     type: `{ 
//             //                         [K in ElementType]: z.output<ReturnType<ElementModules[K]['schema']>> & { type: K } 
//             //                     }[ElementType]`
//             //                 })


//             //                 file.addTypeAlias({
//             //                     name: 'ContentType',
//             //                     type: `ElementType | PrimitiveType`
//             //                 })

//             //                 file.addTypeAlias({
//             //                     name: 'Node<T extends ContentType>',
//             //                     type: `T extends PrimitiveType ? PrimitiveMap[T] : T extends ElementType ? Schema<T> : never`
//             //                 })

//             //                 file.addTypeAlias({
//             //                     name: 'Content<Out, Filter extends readonly ContentType[] | undefined>',
//             //                     type: `Filter extends readonly ContentType[] 
//             //                         ? Omit<Out, "content"> & { content: Node<Filter[number]>[] } 
//             //                         : Omit<Out, "content"> & { content: (Primitive | Element)[] }`
//             //                 })

//             //                 file.addTypeAlias({
//             //                     name: 'Filter<K extends ElementType>',
//             //                     type: `ReturnType<ElementModules[K]["schema"]> extends { __content: infer C }
//             //                       ? C extends readonly ContentType[] ? C : undefined
//             //                       : undefined`
//             //                 })

//             //                 file.addTypeAlias({
//             //                     name: 'Schema<K extends ElementType>',
//             //                     type: `Content<z.output<ReturnType<ElementModules[K]["schema"]>>, Filter<K>> & { type: K }`
//             //                 })

//             //                 file.addExportDeclaration({
//             //                     isTypeOnly: true,
//             //                     namedExports: [
//             //                         'Element',
//             //                         'ElementType',
//             //                         'Primitive',
//             //                         'PrimitiveType'
//             //                     ]
//             //                 })
//             //             })

//             //             // Generate individual element files
//             //             for (const { key, file } of subjects) {
//             //                 await write(join(types, input, 'elements', '+types', `${key}.ts`), async file => {
//             //                     file.addImportDeclaration({
//             //                         moduleSpecifier: '../../types',
//             //                         namedImports: [
//             //                             { name: 'GetAnnotations', isTypeOnly: true },
//             //                         ]
//             //                     });

//             //                     file.addTypeAlias({
//             //                         name: 'Module',
//             //                         type: `typeof import('../${key}')`
//             //                     })

//             //                     file.addTypeAlias({
//             //                         name: 'Annotations',
//             //                         type: `GetAnnotations<Module>`
//             //                     })

//             //                     const moduleDeclaration = file.addModule({
//             //                         name: "Element",
//             //                         isExported: true,
//             //                         declarationKind: ModuleDeclarationKind.Namespace
//             //                     });

//             //                     moduleDeclaration.addTypeAlias({
//             //                         isExported: true,
//             //                         name: 'SchemaArgs',
//             //                         type: `Annotations['SchemaArgs']`
//             //                     })

//             //                     moduleDeclaration.addTypeAlias({
//             //                         isExported: true,
//             //                         name: 'RenderArgs',
//             //                         type: `Annotations['RenderArgs']`
//             //                     })
//             //                 })
//             //             }
//             //         }
//         }
//     };
// };
