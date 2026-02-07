import type { DsvcConfig } from './types';
import { type Plugin } from 'vite';
import { join, relative } from 'path';
import { mkdirSync, readdirSync } from 'fs';
import { pathToFileURL } from 'url';
import _ from 'lodash';
import { ModuleDeclarationKind } from 'ts-morph';
import { write } from '@boswaves-inc/codegen';

const __ext = /\.(ts|tsx|jsx|js|mjs|cjs)$/;
const __cwd = process.cwd();
const __file = readdirSync(__cwd)
    .find((file) => file.replace(__ext, '') === 'dsvc.config');

if (!__file) {
    throw new Error('No dsvc config found');
}

const config = await (async () => {
    const args = await import(pathToFileURL(join(__cwd, __file)).href)

    const {
        namespace,
        routes,
        types
    } = args.default as DsvcConfig

    if (!namespace) {
        throw new Error('Config missing: namespace');
    }

    if (!routes) {
        throw new Error('Config missing: routes');
    }

    return {
        routes,
        output: join(process.cwd(), types ?? '.dsvc'),
        namespace,
    }
})()

export const dsvcPlugin = (): Plugin => {
    const routes = join(__cwd, config.routes, 'routes')

    return {
        name: 'dsvc',
        enforce: 'pre',

        config() {
            return {
                build: {
                    rollupOptions: {
                        external: ['perf_hooks'],
                    },
                },
                ssr: {
                    noExternal: ['@boswaves-inc/dsvc'],
                },
            };
        },

        resolveId(id) {
            if (id === 'virtual:dsvc/server-build') {
                return '\0dsvc/server-build';
            }
        },

        load(id) {
            if (id === '\0dsvc/server-build') {
                return `
                export { default as routes } from "${routes.replace(/\\/g, '/')}";
                export { default as config } from "${join(__cwd, __file).replace(/\\/g, '/')}";
                `;
            }
        },

        buildStart: async () => {
            const types = join(config.output, 'types')
            const routes = join(__cwd, config.routes, 'routes')

            // Read the provided routes diectory
            const files = readdirSync(routes)
                .filter((file) => __ext.test(file))
                .filter((file) => !file.startsWith('_'))

            // Load the route topic
            const subjects = await Promise.all(files.map(async (file) => {
                // const filePath = join(routes, file)

                return {
                    file,
                    key: file.replace(__ext, ''),
                    // topic: `${config.namespace}.${file.replace(__ext, '')}`,
                    subject: `${config.namespace}.${file.replace(__ext, '')}`,
                    rel: './' + join(relative(__cwd, routes), file).replace(/\\/g, '/'),
                }
            }))

            if (subjects.length > 0) {
                mkdirSync(types, { recursive: true })

                // Generate the main routes file
                await write(join(types, '+routes.ts'), async ({ file }) => {
                    file.addTypeAlias({
                        name: 'RouteFiles',
                        type: `{\n
                            ${subjects.map(({ subject, file, key }) => `
                                '${file}': { 
                                    subject: "${subject}";\n 
                                    key: "${key}";\n
                                }
                            `).join('\n')}\n
                        }`
                    })

                    file.addTypeAlias({
                        name: 'RouteModules',
                        type: `{\n
                            ${subjects.map(({ rel, key }) => `
                                '${key}': typeof import('${rel}')
                            `).join('\n')}\n
                        }`
                    })
                })

                // Generate individual route files
                for (const { key } of subjects) {
                    await write(join(types, config.routes, 'routes', '+types', `${key}.ts`), async ({ file }) => {
                        file.addImportDeclaration({
                            moduleSpecifier: '@boswaves-inc/dsvc',
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
                            name: "DsvcRoute",
                            isExported: true,
                            declarationKind: ModuleDeclarationKind.Namespace
                        });

                        moduleDeclaration.addTypeAlias({
                            isExported: true,
                            name: 'MetaArgs',
                            type: `Annotations['MetaArgs']`
                        })

                        moduleDeclaration.addTypeAlias({
                            isExported: true,
                            name: 'SchemaArgs',
                            type: `Annotations['SchemaArgs']`
                        })

                        moduleDeclaration.addTypeAlias({
                            isExported: true,
                            name: 'ActionArgs',
                            type: `Annotations['ActionArgs']`
                        })
                    })
                }
            }
        }
    };
};
