import { join } from "path"
import { toKebabCase } from "string-transform";
import { cpSync, mkdirSync, writeFileSync } from "fs";
import { write } from "@boswaves-inc/codegen";

const project = (name: string) => ({
    "name": `@boswaves-inc/${toKebabCase(`${name}`)}`,
    "private": true,
    "type": "module",
    "scripts": {
        "dev": "dotenv -- vite-node --watch src/index.ts",
        "sdk": "dsvc-sdk",
        "build": "dsvc-build",
        "start": "dotenv -- node dist/index.js",
        "db:gen": "dotenv -- drizzle-kit generate",
        "db:mig": "dotenv -- drizzle-kit migrate"
    },
    "dependencies": {
        "@boswaves-inc/dsvc": "workspace:*",
        "@boswaves-inc/log": "workspace:*",
        "zod-form-data": "^3.0.1",
        "zod": "^4.3.4",
    },
    "devDependencies": {
        "zod-to-ts": "^2.0.0",
        "@types/lodash": "^4.17.20",
        "@types/lodash-es": "^4.17.12",
        "@types/node": "^22.19.3",
        "ts-morph": "^27.0.2",
        "string-transform": "^21.9.19",
        "vite-tsconfig-paths": "^5.1.4",
        "dotenv-cli": "^10.0.0",
        "typescript": "^5.9.2",
        "vite-node": "^5.2.0",
        "vite": "^7.3.0"
    }
})

const tsconfig = () => ({
    "include": [
        ".dsvc/types/**/*",
        "src/**/*",
    ],
    "compilerOptions": {
        "declaration": true,
        "declarationMap": true,
        "composite": true,
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "moduleResolution": "bundler",
        "target": "ES2022",
        "jsx": "react-jsx",
        "module": "ESNext",
        "outDir": "dist",
        "rootDirs": [
            "./",
            "./.dsvc/types",
        ],
        "lib": [
            "DOM",
            "DOM.Iterable",
            "ES2022"
        ],
        "paths": {
            "~/*": [
                "./src/*"
            ],
            "~/schema/*": [
                "./src/schema/*"
            ],
        }
    },
})

export default async (path: string, name: string) => {
    const nodePath = join(path, 'node')

    mkdirSync(nodePath)

    writeFileSync(join(nodePath, 'tsconfig.json'), JSON.stringify(tsconfig()))
    writeFileSync(join(nodePath, 'package.json'), JSON.stringify(project(name)))

    await write(join(nodePath, 'drizzle.config.ts'), async ({ file }) => {
        file.addImportDeclaration({
            namedImports: ['defineConfig'],
            moduleSpecifier: 'drizzle-kit'
        })

        file.addStatements([
            `if (!process.env.PG_DATABASE) {
                throw new Error("PG_DATABASE is not defined");
            }`,
            `if (!process.env.PG_USERNAME) {
                throw new Error("PG_USERNAME is not defined");
            }`,
            `if (!process.env.PG_PASSWORD) {
                throw new Error("PG_PASSWORD is not defined");
            }`
        ])

        file.addExportAssignment({
            isExportEquals: false,
            expression: `defineConfig({
                out: '../../../.drizzle/${name}',
                schema: './src/schema/*',
                dialect: 'postgresql',
                migrations: {
                    table: '_migrations',
                    schema: 'public',
                },
                dbCredentials: {
                    host: process.env.PG_HOST ?? 'localhost',
                    port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
                    user: process.env.PG_USERNAME,
                    password: process.env.PG_PASSWORD,
                    database: process.env.PG_DATABASE,
                    ssl: false,
                }
            })`
        })
    })

    await write(join(nodePath, 'dsvc.config.ts'), async ({ file }) => {
        file.addImportDeclaration({
            namedImports: ['defineConfig'],
            moduleSpecifier: '@boswaves-inc/dsvc/config'
        })

        file.addExportAssignment({
            isExportEquals: false,
            expression: `defineConfig({ namespace: '${name}', routes: './src', output: '../sdk/src' })`
        })
    })

    cpSync(join(import.meta.dirname, '../../templates/node'), nodePath, {
        recursive: true
    })

    writeFileSync(join(nodePath, 'package.json'), JSON.stringify(project(name)))
    writeFileSync(join(nodePath, 'tsconfig.json'), JSON.stringify(tsconfig()))

    cpSync(join(import.meta.dirname, '../../templates/node'), nodePath, {
        recursive: true
    })
}

