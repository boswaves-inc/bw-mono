import type { IHeaders } from "kafkajs";
import z from "zod/v4";

// export interface Context {
//     smtp: Smtp,
//     logger: Logger,
//     postgres: PostgresJsDatabase<typeof schema>
// }


export type RouteHandler = (message: RouteMessage<z.ZodObject>) => Promise<void> | void;

export interface RouteTopic {
    key: string,
    topic: string,
    path: string
}

export interface RouteMessage<T extends z.ZodObject> {
    topic: string,
    partition: number,
    headers?: IHeaders | undefined,
    body: z.output<T>
    // context: Context
}

export interface RouteHandle {
    from_beginning: boolean | undefined
}

export interface RouteModule {
    schema: z.ZodObject
    default: RouteHandler,
    handle?: RouteHandle | undefined
}

export interface RouteMap {
    [topic: string]: {
        module: RouteModule,
        key: string
    }
}