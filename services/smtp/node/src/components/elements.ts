import { readdirSync } from "fs";
import { join } from "path";
import { ElementInfo } from "./types";

const __ext = /\.(ts|tsx|jsx|js|mjs|cjs)$/;
const __cwd = process.cwd();

const load = async () => {
    const elements = join(__cwd, 'src/components/elements')

    const files = readdirSync(elements)
        .filter((file) => __ext.test(file))
        .filter((file) => !file.startsWith('_'))
        .filter((file) => !file.startsWith('.'))

    // Load the route topic
    const topics = await Promise.all(files.map(async file => {
        const module: ElementInfo = await import(join(elements, file))
        // const schema = await module.schema({})

        return {
            module,
            subject: `${file.replace(__ext, '')}`,
        }
    }))

    return topics
}

export default await load();