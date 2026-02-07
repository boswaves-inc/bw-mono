import { createHash } from "crypto"
// import { fileURLToPath } from "url";
// import { dirname } from "path";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as _ from "lodash-es";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const __ext = /\.(ts|tsx|js|jsx)$/;

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const gen_fingerprint = <T>(body: T) => {
    return createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0, 32)
}
