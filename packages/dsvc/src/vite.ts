import type { DsvcConfig } from './types';
import { type Plugin } from 'vite';
import { join, relative } from 'path';
import { mkdirSync, readdirSync, statSync } from 'fs';
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

const discoverRoutes = (dir: string, matches: string[] = []): { folder: string, name: string, key: string, path: string }[] => {
    return readdirSync(dir).flatMap(match => {
        const path = join(dir, match);
        const stat = statSync(path);

        if (stat.isDirectory()) {
            return discoverRoutes(path, matches.concat(match))
        }
        else if (__ext.test(match)) {
            const entries = matches.concat(match.replace(__ext, ''))

            return {
                name: match,
                matches: entries,
                key: entries.join('.'),
                folder: matches.join('/'),
                path: path.replace(dir + '/', ''),
            }
        }
    }).filter(x => x != undefined)
}

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
            const files = discoverRoutes(routes)

            // Load the route topic
            const subjects = await Promise.all(files.map(async ({ key, path, folder, name }) => ({
                rel: './' + relative(routes, path).replace(/\\/g, '/'),
                subject: `${config.namespace}.${key}`,
                name: name.replace(__ext, ''),
                folder,
                path,
                key,
            })))

            console.log(subjects)

            if (subjects.length > 0) {
                mkdirSync(types, { recursive: true })

                // Generate the main routes file
                await write(join(types, '+routes.ts'), async ({ file }) => {
                    file.addTypeAlias({
                        name: 'RouteFiles',
                        type: `{\n
                            ${subjects.map(({ subject, rel, key }) => `
                                '${rel}': { 
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
                                '${key}': typeof import('./${join(config.routes, 'routes', rel).replace(/\\/g, '/')}')
                            `).join('\n')}\n
                        }`
                    })
                })

                // Generate individual route files
                for (const { key, folder, name } of subjects) {
                    await write(join(types, config.routes, 'routes', folder, '+types', `${name}.ts`), async ({ file }) => {
                        file.addImportDeclaration({
                            moduleSpecifier: '@boswaves-inc/dsvc',
                            namedImports: [
                                { name: 'GetAnnotations', isTypeOnly: true },
                            ]
                        });

                        file.addTypeAlias({
                            name: 'Module',
                            type: `typeof import('../${name}')`
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
