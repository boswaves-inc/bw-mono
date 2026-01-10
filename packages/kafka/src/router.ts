// import { Kafka as Primitive, logLevel as KafkaLevel, type Consumer, type Producer, Partitioners, type SASLOptions, type Mechanism, type RetryOptions, type BrokersFunction, } from "kafkajs"
// import { z } from "zod/v4";
// import pino from "pino";
// import type { KafkaLoadContext, RouteHandler, RouteMap, RouteMessage, RouteModule } from "./types";
// import type { ConnectionOptions } from "tls";

// export interface KafkaConfig {
//     brokers: string[] | BrokersFunction
//     namespace: string,
//     routes: string,
//     group: string

//     logger: pino.Logger
//     // transformRoute?: (mod: { module: RouteModule }) => { module: RouteModule }

//     connection?: {
//         ssl?: ConnectionOptions | boolean
//         sasl?: SASLOptions | Mechanism
//         retry?: RetryOptions
//         clientId?: string
//         requestTimeout?: number
//         connectionTimeout?: number
//         authenticationTimeout?: number
//         enforceRequestTimeout?: boolean
//         reauthenticationThreshold?: number

//     }
// }

// interface KafkaRoute {
//     beginning: boolean | undefined;
//     match: (string | RegExp)[];
//     schema: z.ZodObject,
//     handler: RouteHandler;
// };

// export class Kafka {
//     private _consumer: Consumer;
//     private _producer: Producer;
//     private _logger: pino.Logger;

//     private _namespace: string;
//     private _routes: KafkaRoute[] = [];

//     public constructor({ logger, group, namespace, ...rest }: KafkaConfig) {
//         const level_map = {
//             [KafkaLevel.ERROR]: 'error',
//             [KafkaLevel.WARN]: 'warn',
//             [KafkaLevel.INFO]: 'info',
//             [KafkaLevel.DEBUG]: 'debug',
//             [KafkaLevel.NOTHING]: 'silent',
//         } as const

//         this._namespace = namespace
//         this._logger = logger.child({ module: 'kafka' })

//         const client = new Primitive({
//             ...rest,
//             logCreator: () => {
//                 return ({ level, log: { message, ...rest } }) => {
//                     this._logger[level_map[level]](rest, message)
//                 }
//             }
//         })

//         this._producer = client.producer({
//             createPartitioner: Partitioners.DefaultPartitioner,
//         })

//         this._consumer = client.consumer({
//             groupId: group
//         })
//     }

//     private async _load() {
//         const { routes } = await import("@boswaves-inc/kafka-router/routes");

//         for (const [key, module] of Object.entries(routes) as [string, any][]) {
//             const topic = `${this._namespace}.${key}`;
//             this._routes.push({
//                 match: [topic],
//                 schema: module.schema,
//                 handler: module.default,
//                 beginning: module.meta?.().beginning,
//             });
//         }
//     }

//     public on<S extends z.ZodObject>(
//         match: string | (string | RegExp)[],
//         schema: S,
//         handler: (message: RouteMessage<S>) => Promise<void> | void,
//         beginning?: boolean | undefined
//     ) {
//         this._routes.push({
//             match: typeof match === 'string' ? [match] : match,
//             beginning,
//             handler,
//             schema,
//         });
//     }

//     public async run(context: KafkaLoadContext) {
//         await this._consumer.run({
//             eachMessage: async ({ topic, partition, message: { value, headers } }) => {
//                 const route = this._routes.find(r => {
//                     return r.match.some(m => typeof m === 'string' ? m === topic : m.test(topic))
//                 });

//                 if (route != undefined) {
//                     try {
//                         const data = JSON.parse(value?.toString() ?? "{}");
//                         const body = await route.schema.parseAsync(data)

//                         await route.handler({
//                             partition,
//                             // context,
//                             headers,
//                             topic,
//                             body,
//                         });

//                         this._logger.debug({
//                             topic,
//                             partition,
//                             headers,
//                             body
//                         }, 'processed message')
//                     }
//                     catch (error) {

//                     }
//                 }
//             }
//         })


//         //         eachMessage: async ({ topic, partition, message }) => {

//         //     kafka_router.call(topic, message)

//         //     log_client.debug({
//         //         topic,
//         //         partition,
//         //         message: message.value?.toString(),
//         //     })
//         // }
//     }

//     public async connect() {
//         await this._load();
//         await this._consumer.connect();

//         await Promise.all(this._routes.map(({ match, beginning }) =>
//             this._consumer.subscribe({
//                 topics: match,
//                 fromBeginning: beginning,
//             })
//         ));
//     }
//     public async disconnect() {
//         await this._consumer.disconnect()
//     }

//     // public static load(config: Config) {
//     //     const client = new Kafka(config)
//     //     const ss: RouteMap = {}

//     //     for (const [topic, module] of Object.entries(ss)) {
//     //         const { module: transform } = config.transformRoute?.(module) ?? module

//     //         client._routes.push({
//     //             match: [topic],
//     //             schema: transform.schema,
//     //             handler: transform.default,
//     //             beginning: transform.handle?.from_beginning,
//     //         });
//     //     }

//     //     return client
//     // }
// }

// // // export default { logger, config }: { logger: pino.Logger, config: KafkaConfig }) => {
// // //     const level_map = {
// // //         [KafkaLevel.ERROR]: 'error',
// // //         [KafkaLevel.WARN]: 'warn',
// // //         [KafkaLevel.INFO]: 'info',
// // //         [KafkaLevel.DEBUG]: 'debug',
// // //         [KafkaLevel.NOTHING]: 'silent',
// // //     } as const

// // //     const client = new Kafka({
// // //         ...config,
// // //         logCreator: () => {
// // //             const client = logger.child({ module: 'kafka' })

// // //             return ({ level, log: { message, ...rest } }) => {
// // //                 client[level_map[level]](rest, message)
// // //             }
// // //         }
// // //     })

// //     const consumer = client.consumer({
// //         groupId: 'boswaves/smtp',
// //     })

// //     return consumer
// // }