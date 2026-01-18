import {
    connect,
    type NatsConnection,
    JSONCodec,
    type Subscription,
    type Codec,
    type MsgHdrs,
} from 'nats';
import type { NatsLoadContext } from './types';
import z from 'zod/v4';
import pino from 'pino'
import { randomUUID } from 'crypto';
import { attempt, isEmpty, omitBy, isUndefined } from 'lodash';

export interface NatsConfig {
    servers: string | string[];
    name?: string;
    token?: string;
    user?: string;
    pass?: string;
    maxReconnectAttempts?: number;
    reconnectTimeWait?: number;
}

interface RouterConfig {
    servers: string | string[]
    logger: pino.Logger
    group: string
    connection?: {
        name?: string;
        token?: string;
        user?: string;
        pass?: string;
        maxReconnectAttempts?: number;
        reconnectTimeWait?: number;
    }
}

export class Nats {
    private _logger: pino.Logger;
    private _codec: Codec<unknown>;
    private _config: NatsConfig;
    private _subscriptions: Subscription[];

    private _connection: NatsConnection | null = null

    constructor({ servers, connection, logger }: RouterConfig) {
        this._logger = logger.child({ mod: 'nats' })
        this._config = { servers, ...connection };
        this._codec = JSONCodec()

        this._subscriptions = []
    }

    private _parseHeaders(headers: MsgHdrs | undefined) {
        return headers != undefined && {
            code: headers.code,
            status: headers.status,
            description: headers.description
        }
    }

    private _parseError(error: Error) {
        return {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV !== 'production' && error?.stack?.split('\n').map(x => x.trim()).slice(1)
        }
    }

    private _parseStats(instant: number, raw: Uint8Array) {
        return omitBy({
            elapsed_ms: Math.round(performance.now() - instant),
            bytes: raw.length
        }, isUndefined)
    }

    public async listen(context: NatsLoadContext) {
        const { routes } = await import("virtual:nats-router/server-build");

        this._logger.info({
            count: routes.length,
            subjects: routes.map(x => x.subject),
        }, 'Routes loaded');

        const connection = await connect({
            servers: this._config.servers,
            name: this._config.name,
            token: this._config.token,
            user: this._config.user,
            pass: this._config.pass,
            maxReconnectAttempts: this._config.maxReconnectAttempts ?? -1,
            reconnectTimeWait: this._config.reconnectTimeWait ?? 2000,
        });

        // Connection lifecycle logging
        connection.closed().then((err) => {
            if (err) {
                this._logger.error({
                    name: err.name,
                    message: err.message,
                }, 'Connection closed with error');
            }
            else {
                this._logger.info({
                }, 'Connection closed');
            }
        });

        await Promise.all(routes.map(async ({ subject, module }) => {
            const meta = await module.meta?.({ context })
            const schema = await module.schema({ meta, context })

            const subscription = connection.subscribe(subject, {
                callback: async (error, { sid, data, headers, reply, ...rest }) => {
                    const instant = performance.now();
                    const trace_id = randomUUID();

                    const logger = this._logger.child(omitBy({
                        type: isEmpty(reply) ? 'event' : 'request',
                        subject,
                        trace_id,
                        reply_id: isEmpty(reply) ? undefined : reply,
                        sub_id: sid,
                    }, isUndefined))

                    if (error != null) {
                        logger.error({
                            code: error.code,
                            name: error.name,
                        }, 'Failed to read message from buffer');

                        return
                    }

                    logger.debug({
                        size: data.length,
                    }, 'Reading message from buffer');

                    const payload = attempt(() => this._codec.decode(data))

                    if (payload instanceof Error) {
                        logger.error({
                            details: this._parseError(payload),
                            stats: this._parseStats(instant, data)
                        }, 'Failed to decode message payload');

                        return
                    }

                    const body = await schema.safeParseAsync(payload)

                    if (body.success) {
                        try {
                            const result = await module.default({
                                meta,
                                logger,
                                context,
                                body: body.data,
                            })

                            logger.info({
                                result,
                                stats: this._parseStats(instant, data)
                            }, 'Successfully processed message');
                        }
                        catch (err) {
                            const details = err instanceof Error ? err : new Error(String(err))

                            logger.error({
                                details: this._parseError(details),
                                stats: this._parseStats(instant, data)
                            }, 'Failed to process message');
                        }
                    }
                    else {
                        const properties = Object.values(z.treeifyError(body.error, iss => ({
                            path: iss.path.join('.'),
                            code: iss.code,
                            message: iss.message,
                        })).properties ?? {})

                        logger.warn({
                            headers: this._parseHeaders(headers),
                            details: properties.flatMap(x => x?.errors ?? []).slice(0, 5),
                            stats: this._parseStats(instant, data)
                        }, 'Schema validation failed')
                    }
                }
            })

            this._subscriptions.push(subscription)
        }))

        // const jetstream = connection.jetstream();
        // const manager = await connection.jetstreamManager();

        this._logger.info({
            server: connection.getServer()
        }, 'Connected');

        this._connection = connection
    }

    public async disconnect(): Promise<void> {
        // Unsubscribe from all topics
        await Promise.all(this._subscriptions.map(async sub => sub.drain()))

        if (this._connection) {
            await this._connection.drain();

            this._logger.info('Disconnected');
        }
    }
}