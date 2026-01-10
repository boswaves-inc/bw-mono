import type { BrokersFunction, Consumer, Mechanism, Producer, RetryOptions, SASLOptions } from "kafkajs";
import type pino from "pino";
import type { ConnectionOptions } from "tls";
import type { z } from "zod/v4";
import { Kafka as Primitive, logLevel as KafkaLevel, Partitioners, } from 'kafkajs'
import type { KafkaLoadContext, ModuleInfo, ModuleMeta, } from "./types";

interface RouterConfig {
    brokers: string[] | BrokersFunction
    logger: pino.Logger
    group: string

    connection?: {
        ssl?: ConnectionOptions | boolean
        sasl?: SASLOptions | Mechanism
        retry?: RetryOptions
        clientId?: string
        requestTimeout?: number
        connectionTimeout?: number
        authenticationTimeout?: number
        enforceRequestTimeout?: boolean
        reauthenticationThreshold?: number

    }
}

interface RouteDef<S extends z.ZodObject = z.ZodObject> {
    match: (string | RegExp)[];
    meta: ModuleMeta | undefined
    schema: S,
};

export class Kafka {
    private _consumer: Consumer;
    private _producer: Producer;
    private _logger: pino.Logger;

    private _routes: RouteDef[] = [];

    constructor({ logger, group, ...rest }: RouterConfig) {
        const level_map = {
            [KafkaLevel.ERROR]: 'error',
            [KafkaLevel.WARN]: 'warn',
            [KafkaLevel.INFO]: 'info',
            [KafkaLevel.DEBUG]: 'debug',
            [KafkaLevel.NOTHING]: 'silent',
        } as const


        this._logger = logger.child({ module: 'kafka' })

        const client = new Primitive({
            ...rest,
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
            groupId: group
        })

    }

    private async _load(context: KafkaLoadContext) {
        const { routes } = await import("virtual:kafka-router/server-build");

        for (const { topic, module } of routes) {
            const meta = await module.meta?.({ context })
            const schema = await module.schema({ context })

            this._routes.push({
                meta,
                schema,
                match: [
                    topic
                ],
            });
        }
    }

    public async listen(context: KafkaLoadContext) {
        await this._load(context)
        await this._consumer.connect()

        await Promise.all(this._routes.map(({ match, meta }) => {
            return this._consumer.subscribe({
                topics: match,
                fromBeginning: meta?.beginning ?? false
            })
        }))

        await this._consumer.run({
            eachMessage: async ({ topic, partition, message: { value, headers } }) => {
                const route = this._routes.find(r => {
                    return r.match.some(m => typeof m === 'string' ? m === topic : m.test(topic))
                });

                if (route != undefined) {
                    try {
                        const data = JSON.parse(value?.toString() ?? "{}");
                        const body = await route.schema.parseAsync(data)

                        // await route.handler({
                        //     partition,
                        //     // context,
                        //     headers,
                        //     topic,
                        //     body,
                        // });

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
    }

    public async disconnect () {
        await this._consumer.disconnect()
        await this._producer.disconnect()
    }
}

