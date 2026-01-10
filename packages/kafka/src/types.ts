import z from "zod/v4";

type ResultType<T> = T extends (...args: any) => any
    ? Awaited<ReturnType<T>>
    : never;

export type ModuleMeta = {
    beginning?: boolean;
};

export type ModuleInfo<S extends z.ZodObject = z.ZodObject> = {
    meta?: (args: { context: KafkaLoadContext }) => ModuleMeta | Promise<ModuleMeta>;
    schema: (args: { context: KafkaLoadContext }) => S | Promise<S>;
    default: (args: any) => void | Promise<void>;
};


type CreateMetaArgs<T extends ModuleInfo> = {
    context: KafkaLoadContext;
};

type CreateSchemaArgs<T extends ModuleInfo> = {
    meta: ResultType<T['meta']> extends infer U extends ModuleMeta ? U : never,
    context: KafkaLoadContext;
};

type CreateActionArgs<T extends ModuleInfo> = {
    meta: ResultType<T['meta']> extends infer U extends ModuleMeta ? U : never,
    body: ResultType<T['schema']> extends infer U extends z.ZodObject ? z.output<U> : never;
    context: KafkaLoadContext;
};

export type GetAnnotations<T extends ModuleInfo> = {
    MetaArgs: CreateMetaArgs<T>;
    SchemaArgs: CreateSchemaArgs<T>;
    ActionArgs: CreateActionArgs<T>;
};

export interface KafkaLoadContext {

}

export interface Headers {
    [key: string]: Buffer | string | (Buffer | string)[] | undefined
}

// export interface Config {
//     brokers: string[] | BrokersFunction
//     namespace: string,
//     routes: string,
//     group: string

//     logger: pino.Logger
//     transformRoute?: (mod: { module: RouteModule }) => { module: RouteModule }

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

// export type RouteHandler = (message: RouteMessage<z.ZodObject>) => Promise<void> | void;

// export interface RouteTopic {
//     key: string,
//     topic: string,
//     path: string
// }

// export interface RouteMessage<T extends z.ZodObject> {
//     topic: string,
//     partition: number,
//     headers?: Headers | undefined,
//     body: z.output<T>
//     // context: Context
// }

// export interface RouteHandle {
//     from_beginning: boolean | undefined
// }

// export interface RouteModule {
//     schema: z.ZodObject
//     default: RouteHandler,
//     handle?: RouteHandle | undefined
// }

// export interface RouteMap {
//     [topic: string]: {
//         module: RouteModule,
//         // key: string
//     }
// }

export interface KafkaConfig {
    namespace: string
    routes: string
    out?: string
}