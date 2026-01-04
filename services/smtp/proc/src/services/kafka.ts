import { Kafka as Primitive, KafkaConfig, logLevel as KafkaLevel, Consumer, Producer, Partitioners, } from "kafkajs"
import { Context, RouteHandler } from "../types";
import { Logger } from "~/services/logger";

interface KafkaRoute {
    beginning: boolean | undefined;
    match: (string | RegExp)[];
    handler: RouteHandler;
};

export class Kafka {
    private _consumer: Consumer;
    private _producer: Producer;

    private _routes: KafkaRoute[] = [];

    constructor({ logger, config }: { logger: Logger, config: KafkaConfig }) {
        const level_map = {
            [KafkaLevel.ERROR]: 'error',
            [KafkaLevel.WARN]: 'warn',
            [KafkaLevel.INFO]: 'info',
            [KafkaLevel.DEBUG]: 'debug',
            [KafkaLevel.NOTHING]: 'silent',
        } as const

        const client = new Primitive({
            ...config,
            logCreator: () => {
                const client = logger.child({ module: 'kafka' })

                return ({ level, log: { message, ...rest } }) => {
                    client[level_map[level]](rest, message)
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

    public on(match: string | (string | RegExp)[], handler: RouteHandler, beginning?: boolean | undefined) {
        this._routes.push({
            match: typeof match === 'string' ? [match] : match,
            beginning,
            handler,
        });
    }

    public async run(context: Context) {
        await this._consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(topic)

                const route = this._routes.find(r => {
                    return r.match.some(m => typeof m === 'string' ? m === topic : m.test(topic))
                });

                if (route == undefined) {
                    return
                }
                
                else {
                    await route.handler({
                        partition,
                        context,
                        message
                    });
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