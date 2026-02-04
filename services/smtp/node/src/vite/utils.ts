import { readdirSync } from "fs";
import { join, relative } from "path";

export const __ext = /\.(ts|tsx|jsx|js|mjs|cjs)$/;
export const __cwd = process.cwd();

export const __primitives = ['string', 'boolean', 'number']
export const __types = join('.codegen', 'types')

export const loadElements = async (dir: string) => {
    // Read the provided elements diectory
    const files = readdirSync(dir)
        .filter((file) => __ext.test(file))
        .filter((file) => !file.startsWith('_'))
        .filter((file) => !file.startsWith('.'))

    // Load the route topic
    return await Promise.all(files.map(async file => {
        return {
            file,
            key: file.replace(__ext, ''),
            rel: './' + join(relative(__cwd, dir), file).replace(/\\/g, '/'),
        }
    }))

}