import { type Plugin } from 'vite';
import { ModuleDeclarationKind, VariableDeclarationKind } from 'ts-morph';
import { write } from '@boswaves-inc/codegen';
import { mkdirSync, readdirSync } from 'fs';
import { join, relative } from 'path';

const __ext = /\.(ts|tsx|jsx|js|mjs|cjs)$/;
const __cwd = process.cwd();

interface CodegenConfig {
    input: string
}

export const elementsPlugin = ({ input }: CodegenConfig): Plugin => {
    const elements = join(__cwd, input, 'elements')
    const types = join('.codegen', 'types')

    return {
        name: 'smtp',
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
                mkdirSync(types, { recursive: true })

                // Generate the main elements file
                await write(join(types, '+elements.ts'), async file => {
                    file.addTypeAlias({
                        isExported: true,
                        name: 'ElementModules',
                        type: `{\n
                            ${subjects.map(({ rel, key }) => `
                                '${key}': typeof import('${rel}')
                            `).join('\n')}\n
                        }`
                    })

                    file.addTypeAlias({
                        isExported: true,
                        name: 'ElementType',
                        type: `keyof ElementModules`
                    })

                    file.addTypeAlias({
                        isExported: true,
                        name: 'ElementEntry<S extends ElementType = ElementType>',
                        type: `{
                            subject: S,
                            module: ElementModules[S]
                        }`
                    })
                })

                // // Generate the main elements file
                // await write(join(types, '+runtime.ts'), async file => {
                //     file.addImportDeclaration({
                //         isTypeOnly: true,
                //         namedImports: ['ElementEntry'],
                //         moduleSpecifier: './+elements'
                //     })
                    
                //     file.addImportDeclarations(subjects.map(({ rel, key }, i) => ({
                //         moduleSpecifier: rel.replace(__ext, ''),
                //         namespaceImport: `__${i}`,
                //     })));


                //     file.addVariableStatement({
                //         declarationKind: VariableDeclarationKind.Const,
                //         isExported: true,
                //         declarations: [
                //             {
                //                 name: "elements",
                //                 initializer: writer => {
                //                     writer.writeLine("[");
                //                     subjects.forEach(({ key }, i) => {
                //                         writer.writeLine(`  { subject: "${key}", module: __${i} },`);
                //                     });
                //                     writer.write("] as const satisfies readonly ElementEntry[]");
                //                 }
                //             }
                //         ]
                //     });
                //     // file.addTypeAlias({
                //     //     isExported: true,
                //     //     name: 'ElementType',
                //     //     type: `keyof ElementModules`
                //     // })

                //     // file.addTypeAlias({
                //     //     isExported: true,
                //     //     name: 'ElementEntry<S extends ElementType = ElementType>',
                //     //     type: `{
                //     //         subject: S,
                //     //         module: ElementModules[S]
                //     //     }`
                //     // })
                // })


                // Generate individual element files
                for (const { key, file } of subjects) {
                    await write(join(types, input, 'elements', '+types', `${key}.ts`), async file => {
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
