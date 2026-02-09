import { join } from "path"
import { toKebabCase } from "string-transform";
import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { edit, write } from "@boswaves-inc/codegen";
import { getActiveResourcesInfo } from "node:process";
import { Project, SyntaxKind } from "ts-morph";

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
        "@boswaves-inc/tracing": "workspace:*",
        "@boswaves-inc/dsvc": "workspace:*",
        "zod-form-data": "^3.0.1",
        "drizzle-orm": "^0.45.1",
        "drizzle-zod": "^0.8.3",
        "postgres": "^3.4.7",
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

    writeFileSync(join(nodePath, 'tsconfig.json'), JSON.stringify(tsconfig(), null, 2))
    writeFileSync(join(nodePath, 'package.json'), JSON.stringify(project(name), null, 2))

    cpSync(join(import.meta.dirname, '../../templates/node'), nodePath, {
        recursive: true
    })

    await edit(join(nodePath, 'dsvc.config.ts'), async ({ file }) => {
        const config = file.getExportAssignmentOrThrow(a => !a.isExportEquals());
        const expr = config.getExpressionIfKindOrThrow(SyntaxKind.CallExpression);
        const args = expr.getArguments().at(0)

        if (args?.isKind(SyntaxKind.ObjectLiteralExpression)) {
            const group = args.getPropertyOrThrow('namespace')
            if (group.isKind(SyntaxKind.PropertyAssignment)) {
                group.setInitializer(`'${name}'`)
            }
        }
    })

    await edit(join(nodePath, 'src/index.ts'), async ({ file, project }) => {
        const router = file.getVariableDeclarationOrThrow('router')

        const expr = router.getInitializerIfKindOrThrow(SyntaxKind.NewExpression);
        const args = expr.getArguments().at(0)

        if (args?.isKind(SyntaxKind.ObjectLiteralExpression)) {
            const group = args.getPropertyOrThrow('group')
            if (group.isKind(SyntaxKind.PropertyAssignment)) {
                group.setInitializer(`'@boswaves-inc/${name}'`)
            }
        }
    })
}

