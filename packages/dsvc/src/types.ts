import { write } from "@boswaves-inc/codegen";
import type pino from "pino";
import type { ZodToTsOptions } from "zod-to-ts";
import z from "zod/v4";

// type Method = 'patch' | 'put' | 'post' | 'delete' | 'get'

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
    // method: Method,
    logger: pino.Logger;
    context: DsvcLoadContext;
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

export interface DsvcHeaders {
    [key: string]: Buffer | string | (Buffer | string)[] | undefined
}

export interface DsvcConfig {
    namespace: string
    routes: string
    types?: string
    output: string,
    build?: (args: DsvcBuildContext & { write: typeof write }) => any
}

export interface DsvcBuildContext {
    remap: Map<string, string>
    store: ZodToTsOptions['auxiliaryTypeStore'],
    imports: Array<{ module: string, statements: string[] }>
}

export interface DsvcLoadContext { }