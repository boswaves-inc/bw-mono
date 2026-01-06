import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { KafkaMessage as PrimitiveMessage } from "kafkajs"
import { Logger } from "~/services/logger"
import schema from '~/schema/index'
import { Smtp } from "./services/smtp";
import { ZodObject, ZodType } from "zod/v4";

export interface Context {
    smtp: Smtp,
    logger: Logger,
    postgres: PostgresJsDatabase<typeof schema>
}

export interface BlockType {
    key: string,
    path: string
}

export interface BlockModule {
    schema: ZodObject | undefined
    // default: RouteHandler,
}

export interface BlockMap {
    [topic: string]: BlockModule,
}

export type RouteHandler = (message: RouteMessage) => Promise<void> | void;

export interface RouteTopic {
    key: string,
    topic: string,
    path: string
}

export interface RouteMessage {
    partition: number,
    message: PrimitiveMessage,
    context: Context
}

export interface RouteHandle {
    from_beginning: boolean | undefined
}

export interface RouteModule {
    schema: ZodObject
    default: RouteHandler,
    handle?: RouteHandle | undefined
}

export interface RouteMap {
    [topic: string]: {
        module: RouteModule,
        key: string
    }
}