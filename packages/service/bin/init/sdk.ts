import { join } from "path"
import { toKebabCase } from "string-transform";
import { cpSync, mkdirSync, writeFileSync } from "fs";

const project = (name: string) => ({
    "name": `@boswaves-inc/${toKebabCase(`${name}`)}-sdk`,
    "type": "module",
    "exports": {
        ".": "./src/index.ts"
    },
    "dependencies": {
        "nats": "^2.29.3"
    },
    "devDependencies": {
        "typescript": "^5.9.2"
    }
})

const tsconfig = () => ({
    "include": [
        "src/**/*"
    ],
    "compilerOptions": {
        "target": "ES2022",
        "composite": true,
        "strict": true,
        "jsx": "react-jsx",
        "module": "ES2022",
        "moduleResolution": "bundler",
        "esModuleInterop": true,
        "skipLibCheck": true,
        "resolveJsonModule": true,
        "outDir": "dist",
        "rootDir": "./src",
        "declarationMap": true,
        "declaration": true,
        "noEmit": false,
        "lib": [
            "DOM",
            "DOM.Iterable",
            "ES2022"
        ]
    }
})

export default async (path: string, name: string) => {
    const target = join(path, 'sdk')

    mkdirSync(target)

    cpSync(join(import.meta.dirname, '../../templates/sdk'), target, {
        recursive: true
    })

    writeFileSync(join(target, 'package.json'), JSON.stringify(project(name)))
    writeFileSync(join(target, 'tsconfig.json'), JSON.stringify(tsconfig()))
}

