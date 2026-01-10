import { Kafka as Primitive, type KafkaConfig, logLevel as KafkaLevel, type Consumer, type Producer, Partitioners, } from "kafkajs"
import { Context } from "../../types";
import { Logger } from "../logger";
import { z } from "zod/v4";
import pino from "pino";
import type { RouteHandler } from "./types";

interface KafkaRoute {
    beginning: boolean | undefined;
    match: (string | RegExp)[];
    schema: z.ZodObject,
    handler: RouteHandler;
};

export class Kafka {
    private _consumer: Consumer;
    private _producer: Producer;
    private _logger: pino.Logger;

    private _routes: KafkaRoute[] = [];

    constructor({ logger, config }: { logger: Logger, config: KafkaConfig }) {
        const level_map = {
            [KafkaLevel.ERROR]: 'error',
            [KafkaLevel.WARN]: 'warn',
            [KafkaLevel.INFO]: 'info',
            [KafkaLevel.DEBUG]: 'debug',
            [KafkaLevel.NOTHING]: 'silent',
        } as const

        this._logger = logger.child({ module: 'kafka' })

        const client = new Primitive({
            ...config,
            logCreator: () => {
                return ({ level, log: { message, ...rest } }) => {
                    this._logger[level_map[level]](rest, message)
                }
            }
        })

        this._producer = client.producer({
            createPartitioner: Partitioners.DefaultPartitioner,
        })

        this._consumer = client.consumer({
            groupId: 'boswaves/smtp',
        })
    }

    public on(match: string | (string | RegExp)[], schema: z.ZodObject, handler: RouteHandler, beginning?: boolean | undefined) {
        this._routes.push({
            match: typeof match === 'string' ? [match] : match,
            beginning,
            handler,
            schema,
        });
    }

    public async run(context: Context) {
        await this._consumer.run({
            eachMessage: async ({ topic, partition, message: { value, headers } }) => {
                const route = this._routes.find(r => {
                    return r.match.some(m => typeof m === 'string' ? m === topic : m.test(topic))
                });

                if (route != undefined) {
                    try {
                        const data = JSON.parse(value?.toString() ?? "{}");
                        const body = await route.schema.parseAsync(data)

                        await route.handler({
                            partition,
                            // context,
                            headers,
                            topic,
                            body,
                        });

                        this._logger.debug({
                            topic,
                            partition,
                            headers,
                            body
                        }, 'processed message')
                    }
                    catch (error) {

                    }
                }
            }
        })


        //         eachMessage: async ({ topic, partition, message }) => {

        //     kafka_router.call(topic, message)

        //     log_client.debug({
        //         topic,
        //         partition,
        //         message: message.value?.toString(),
        //     })
        // }
    }

    public async connect() {
        await this._consumer.connect()
        await Promise.all(this._routes.map(({ match, beginning }) => this._consumer.subscribe({
            topics: match,
            fromBeginning: beginning
        })))
    }

    public async disconnect() {
        await this._consumer.disconnect()
    }
}

// // export default { logger, config }: { logger: pino.Logger, config: KafkaConfig }) => {
// //     const level_map = {
// //         [KafkaLevel.ERROR]: 'error',
// //         [KafkaLevel.WARN]: 'warn',
// //         [KafkaLevel.INFO]: 'info',
// //         [KafkaLevel.DEBUG]: 'debug',
// //         [KafkaLevel.NOTHING]: 'silent',
// //     } as const

// //     const client = new Kafka({
// //         ...config,
// //         logCreator: () => {
// //             const client = logger.child({ module: 'kafka' })

// //             return ({ level, log: { message, ...rest } }) => {
// //                 client[level_map[level]](rest, message)
// //             }
// //         }
// //     })

//     const consumer = client.consumer({
//         groupId: 'boswaves/smtp',
//     })

//     return consumer
// }