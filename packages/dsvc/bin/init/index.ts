#!/usr/bin/env tsx

import { dirname, join} from "path"
import { toKebabCase } from "string-transform";
import { fileURLToPath } from "url"
import * as readline from 'readline';
import { cpSync, existsSync, mkdirSync, writeFileSync } from "fs";
import node from "./node";

const __cwd = process.cwd()



// const sdk_project = (name: string) => ({
//     "name": `@boswaves-inc/${toKebabCase(`${name}-sdk`)}`,
//     "type": "module",
//     "exports": {
//         ".": "./src/index.ts"
//     },
//     "dependencies": {
//         "nats": "^2.29.3"
//     },
//     "devDependencies": {
//         "typescript": "^5.9.2"
//     }
// })

// const sdk_tsconfig = () => ({
//     "include": [
//         "src/**/*"
//     ],
//     "compilerOptions": {
//         "target": "ES2022",
//         "composite": true,
//         "strict": true,
//         "jsx": "react-jsx",
//         "module": "ES2022",
//         "moduleResolution": "bundler",
//         "esModuleInterop": true,
//         "skipLibCheck": true,
//         "resolveJsonModule": true,
//         "outDir": "dist",
//         "rootDir": "./src",
//         "declarationMap": true,
//         "declaration": true,
//         "noEmit": false,
//         "lib": [
//             "DOM",
//             "DOM.Iterable",
//             "ES2022"
//         ]
//     }
// })

export default async () => {
    const target = process.argv[2] || '.';
    const reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    reader.question("Enter project name: ", async (name: string) => {
        const trimmed = name.trim()
        const path = join(__cwd, target, trimmed);

        if (!trimmed) {
            console.error('Error: Project name cannot be empty');

            reader.close();
            process.exit(1);
        }

        if (existsSync(path)) {
            console.error(`Error: Folder "${name}" already exists`);

            reader.close();
            process.exit(1);
        }

        await node(path, trimmed)

        // mkdirSync(sdkPath)
        // mkdirSync(join(sdkPath, 'src'))

        // writeFileSync(join(sdkPath, 'package.json'), JSON.stringify(sdk_project(trimmed)))
    })
}

