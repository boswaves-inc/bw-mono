import { type Plugin } from 'vite';
import { ModuleDeclarationKind } from 'ts-morph';
import { write } from '@boswaves-inc/codegen';
import { mkdirSync } from 'fs';
import { readdirSync } from "fs";
import { join, relative } from "path";

export const __ext = /\.(ts|tsx|jsx|js|mjs|cjs)$/;
export const __cwd = process.cwd();

export const __primitives = ['string', 'boolean', 'number']
export const __types = join('.codegen', 'types')

export const elementsPlugin = ({ input }: { input: string }): Plugin => {
    const elements = join(__cwd, input, 'elements')

    return {
        name: 'smtp/elements',
        enforce: 'pre',

        config: () => {
            return {
                build: {
                    rollupOptions: {
                        external: ['perf_hooks'],
                    },
                },
                ssr: {
                    noExternal: ['@boswaves-inc/smtp'],
                },
            };
        },

        resolveId: (id) => {
            if (id === "virtual:smtp/elements") {
                return "\0virtual:smtp/elements"
            };
        },

        load: async (id) => {
            if (id === "\0virtual:smtp/elements") {
                return `export { default as elements, element_map } from "${elements.replace(/\\/g, '/')}";`
            }
        },

        buildStart: async () => {
            // Read the provided elements diectory
            const files = readdirSync(elements)
                .filter((file) => __ext.test(file))
                .filter((file) => !file.startsWith('_'))
                .filter((file) => !file.startsWith('.'))

            // Load the route topic
            const subjects = await Promise.all(files.map(async file => {
                return {
                    file,
                    key: file.replace(__ext, ''),
                    rel: './' + join(relative(__cwd, elements), file).replace(/\\/g, '/'),
                }
            }))

            if (subjects.length > 0) {
                mkdirSync(__types, { recursive: true })

                // Generate the main elements file
                await write(join(__types, '+elements.ts'), async ({ file }) => {
                    file.addImportDeclaration({
                        isTypeOnly: true,
                        moduleSpecifier: 'zod/v4',
                        defaultImport: 'z',
                    });

                    file.addTypeAlias({
                        name: 'ElementModules',
                        type: `{\n
                            ${subjects.map(({ rel, key }) => `
                                '${key}': typeof import('${rel}')
                            `).join('\n')}\n
                        }`
                    })

                    file.addTypeAlias({
                        name: 'PrimitiveMap',
                        type: `{
                            ${__primitives.map(x => `${x}: ${x};`).join('\n')}
                        }`
                    })

                    file.addTypeAlias({
                        name: 'PrimitiveType',
                        type: `keyof PrimitiveMap`
                    })

                    file.addTypeAlias({
                        name: 'Primitive',
                        type: `PrimitiveMap[PrimitiveType]`
                    })

                    file.addTypeAlias({
                        name: 'ElementType',
                        type: `keyof ElementModules`
                    })

                    file.addTypeAlias({
                        name: 'Element',
                        type: `{ 
                            [K in ElementType]: z.output<ReturnType<ElementModules[K]['schema']>> & { type: K } 
                        }[ElementType]`
                    })


                    file.addTypeAlias({
                        name: 'ContentType',
                        type: `ElementType | PrimitiveType`
                    })

                    file.addTypeAlias({
                        name: 'Node<T extends ContentType>',
                        type: `T extends PrimitiveType ? PrimitiveMap[T] : T extends ElementType ? Schema<T> : never`
                    })

                    file.addTypeAlias({
                        name: 'Content<Out, Filter extends readonly ContentType[] | undefined>',
                        type: `Filter extends readonly ContentType[] 
                            ? Omit<Out, "content"> & { content: Node<Filter[number]>[] } 
                            : Omit<Out, "content"> & { content: (Primitive | Element)[] }`
                    })

                    file.addTypeAlias({
                        name: 'Filter<K extends ElementType>',
                        type: `ReturnType<ElementModules[K]["schema"]> extends { __content: infer C }
                          ? C extends readonly ContentType[] ? C : undefined
                          : undefined`
                    })

                    file.addTypeAlias({
                        name: 'Schema<K extends ElementType>',
                        type: `Content<z.output<ReturnType<ElementModules[K]["schema"]>>, Filter<K>> & { type: K }`
                    })

                    file.addExportDeclaration({
                        isTypeOnly: true,
                        namedExports: [
                            'Element',
                            'ElementType',
                            'Primitive',
                            'PrimitiveType'
                        ]
                    })
                })

                // Generate individual element files
                for (const { key } of subjects) {
                    await write(join(__types, input, 'elements', '+types', `${key}.ts`), async ({ file }) => {
                        file.addImportDeclaration({
                            moduleSpecifier: '../../types',
                            namedImports: [
                                { name: 'GetAnnotations', isTypeOnly: true },
                            ]
                        });

                        file.addTypeAlias({
                            name: 'Module',
                            type: `typeof import('../${key}')`
                        })

                        file.addTypeAlias({
                            name: 'Annotations',
                            type: `GetAnnotations<Module>`
                        })

                        const moduleDeclaration = file.addModule({
                            name: "Element",
                            isExported: true,
                            declarationKind: ModuleDeclarationKind.Namespace
                        });

                        moduleDeclaration.addTypeAlias({
                            isExported: true,
                            name: 'SchemaArgs',
                            type: `Annotations['SchemaArgs']`
                        })

                        moduleDeclaration.addTypeAlias({
                            isExported: true,
                            name: 'RenderArgs',
                            type: `Annotations['RenderArgs']`
                        })
                    })
                }
            }
        }
    };
};