// import z from "zod/v4";
// import { fileURLToPath, pathToFileURL } from "url";
// import { dirname, join } from "path";
// import { existsSync, readdirSync } from "fs";
// import { ElementMap, ElementModule, ElementType } from "./components/elements/_base";
// import * as _ from "lodash-es";
// import { RouteMap, RouteModule, RouteTopic } from "./routes/_base";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const __ext = /\.(ts|tsx|js|jsx)$/;

// export const loadRouteMap = async () => {
//     const root = join(__dirname, 'routes')

//     if (!existsSync(root)) {
//         throw new Error(`Routes directory not found: ${root}`);
//     }

//     const topics = readdirSync(root)
//         .filter((file) => __ext.test(file))
//         .filter((file) => !file.startsWith('_'))
//         .map<RouteTopic>(file => ({
//             topic: `smtp.${file.replace(__ext, "")}`,
//             key: file.replace(__ext, ""),
//             path: file
//         }))

//     const entries = await Promise.all(
//         topics.map(async ({ topic, key, path }): Promise<[string, { key: string; module: RouteModule }] | null> => {
//             const file = join(root, path)
//             const module: RouteModule = await import(pathToFileURL(file).href)

//             if (module.default == undefined) {
//                 return undefined
//             }

//             if (module.schema == undefined) {
//                 throw new Error(`schema not exported from route: ${file}`)
//             }

//             if (module.schema.type !== 'object') {
//                 throw new Error(`schema has to be typeof ZodObject: ${file}`)
//             }

//             return [topic, { key, module }]
//         })
//     );

//     return _.filter(entries, val => !_.isUndefined(val)).reduce<RouteMap>((prev, [topic, module]) => ({
//         ...prev, [topic]: module
//     }), {});
// }

// export const loadElementMap = async () => {
//     const root = join(__dirname, 'elements')

//     if (!existsSync(root)) {
//         throw new Error(`Routes directory not found: ${root}`);
//     }

//     const blocks = readdirSync(root)
//         .filter((file) => __ext.test(file))
//         .filter((file) => !file.startsWith('_'))
//         .map<ElementType>(file => ({
//             key: file.replace(__ext, ""),
//             path: file
//         }))

//     const entries = await Promise.all(
//         blocks.map<Promise<[string, ElementModule] | null>>(async ({ key, path }) => {
//             const file = join(root, path)
//             const module: ElementModule = await import(pathToFileURL(file).href)

//             // if (module.default == undefined) {
//             //     return undefined
//             // }

//             if (module.schema != undefined) {
//                 if (module.schema.type !== 'object') {
//                     throw new Error(`schema has to be typeof ZodObject: ${file}`)
//                 }

//                 const schema = module.schema.extend({
//                 })

//                 return [key, { schema }]
//             }

//             // if (module.default == undefined) {
//             //     throw new Error(`handler not exported from route: ${file}`)
//             // }

//             return [key, { schema: z.object({}) }]
//         })
//     )

//     return _.filter(entries, val => !_.isUndefined(val)).reduce<ElementMap>((prev, [topic, module]) => ({
//         ...prev, [topic]: module
//     }), {});
// }

// // export const template = <T extends ZodType>(name: string, shape: T, render: Renderer<T>) => {
// //     const handler = (data: unknown) => formData(shape).parseAsync(data).then(async x => {
// //         const html = await renderTemplate(render(x))
// //         const text = toPlainText(html)

// //         return { html, text, default: html }
// //     }).catch(err => {
// //         throw err
// //     })

// //     return { name, handler, render }
// // }