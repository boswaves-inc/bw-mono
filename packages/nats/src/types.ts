import type pino from "pino";
import z from "zod/v4";

type ResultType<T> = T extends (...args: any) => any
    ? Awaited<ReturnType<T>>
    : never;

type CreateMetaArgs<T extends ModuleInfo = ModuleInfo> = {
    // context: NatsLoadContext;
};

type CreateSchemaArgs<T extends ModuleInfo = ModuleInfo> = {
    meta: ResultType<T['meta']> extends infer U extends ModuleMeta ? U : never,
    // context: NatsLoadContext;
};

type CreateActionArgs<T extends ModuleInfo = ModuleInfo> = {
    meta: ResultType<T['meta']> extends infer U extends ModuleMeta ? U : never,
    body: ResultType<T['schema']> extends infer U extends z.ZodObject ? z.output<U> : never;
    logger: pino.Logger;
    context: NatsLoadContext;
};

export type ModuleMeta = {
    // beginning?: boolean;
};

export type ModuleInfo<S extends z.ZodObject = z.ZodObject> = {
    meta?: (args: CreateMetaArgs) => ModuleMeta | Promise<ModuleMeta>;
    schema: (args: Omit<CreateSchemaArgs, 'meta'> & { meta: ModuleMeta | undefined }) => S | Promise<S>;
    default: (args: Omit<CreateActionArgs, 'meta'> & { meta: ModuleMeta | undefined }) => void | Promise<void>;
};

export type GetAnnotations<T extends ModuleInfo> = {
    MetaArgs: CreateMetaArgs<T>;
    SchemaArgs: CreateSchemaArgs<T>;
    ActionArgs: CreateActionArgs<T>;
};

export interface NatsHeaders {
    [key: string]: Buffer | string | (Buffer | string)[] | undefined
}

export interface NatsConfig {
    namespace: string
    routes: string
    // out?: string,
    sdk: {
        out: string,
        factory: (args: {
            routes: typeof import('virtual:nats-router/server-build').routes
            // write: (store: ZodToTsOptions['auxiliaryTypeStore']) => any
        }) => void
    }
}

export interface NatsLoadContext { }