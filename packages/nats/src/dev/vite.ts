import type { NatsConfig } from '../types';
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
    .find((file) => file.replace(__ext, '') === 'nats.config');

if (!__file) {
    throw new Error('No nats config found');
}

const path = join(__cwd, __file);
const config = await import(pathToFileURL(path).href).then(({ default: { namespace, routes, out } }: { default: Partial<NatsConfig> }) => {
    if (!namespace) {
        throw new Error('Config missing: namespace');
    }

    if (!routes) {
        throw new Error('Config missing: routes');
    }

    return {
        out: join(process.cwd(), out ?? '.nats-router'),
        routes: join(process.cwd(), routes),
        input: routes,
        namespace,
    }
});

export const natsRouterPlugin = (): Plugin => {
    const routes = join(__cwd, config.input, 'routes')

    return {
        name: 'nats-router',
        enforce: 'pre',

        config() {
            return {
                build: {
                    rollupOptions: {
                        external: ['perf_hooks'],
                    },
                },
                ssr: {
                    noExternal: ['@boswaves-inc/nats-router'],
                },
            };
        },

        resolveId(id) {
            if (id === 'virtual:nats-router/server-build') {
                return '\nats-router/server-build';
            }
        },

        load(id) {
            if (id === '\nats-router/server-build') {
                return `
                    export { default as routes } from "${routes.replace(/\\/g, '/')}";
                `;
            }
        },

        buildStart: async () => {
            const types = join(config.out, 'types')
            const routes = join(__cwd, config.input, 'routes')

            // Read the provided routes diectory
            const files = readdirSync(routes)
                .filter((file) => __ext.test(file))
                .filter((file) => !file.startsWith('_'))

            // Load the route topic
            const subjects = await Promise.all(files.map(async file => {
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
                await write(join(types, '+routes.ts'), async file => {
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
                for (const { key, file } of subjects) {
                    await write(join(types, config.input, 'routes', '+types', `${key}.ts`), async file => {
                        file.addImportDeclaration({
                            moduleSpecifier: '@boswaves-inc/nats-router',
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
                            name: "NatsRoute",
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
