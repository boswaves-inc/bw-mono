import z from "zod/v4";

type ResultType<T> = T extends (...args: any) => any
    ? Awaited<ReturnType<T>>
    : never;

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

export type ModuleMeta = {
    beginning?: boolean;
};

export type ModuleInfo<S extends z.ZodObject = z.ZodObject> = {
    meta?: (args: { context: KafkaLoadContext }) => ModuleMeta | Promise<ModuleMeta>;
    schema: (args: { context: KafkaLoadContext }) => S | Promise<S>;
    default: (args: any) => void | Promise<void>;
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
    out?: string
}

export interface KafkaLoadContext { }