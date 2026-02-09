#!/usr/bin/env tsx

import { join } from "path"
import * as readline from 'readline';
import { existsSync, mkdirSync } from "fs";
import node from "./node";
import sdk from "./sdk";

const __cwd = process.cwd()

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

    mkdirSync(path)

    await node(path, trimmed)
    await sdk(path, trimmed)

    reader.close()
})

