import z from "zod/v4";
import { ReactNode } from "react";
import { ElementType } from "../../+elements";

type PrimitiveMap = {
    string: string;
    number: number;
    boolean: boolean;
};

type PrimitiveType = keyof PrimitiveMap;

type AllPrimitives<C extends readonly ContentType[]> =
    Exclude<C[number], PrimitiveType> extends never ? true : false;

type ContentType = ElementType | PrimitiveType;

type ResultType<T> = T extends (...args: any) => any
    ? Awaited<ReturnType<T>>
    : never;

type ContentNode<T extends ContentType = ContentType> = {
    type: T;
} & Record<string, unknown>;

type ContentFn<S extends z.ZodRawShape> = {
    (): z.ZodObject<S & { content: z.ZodType<ContentNode[]> }> & { __content: readonly ContentType[] };
    <const C extends readonly ContentType[]>(types: C): z.ZodObject<S & { content: z.ZodType<ContentNode<C[number]>[]> }> & { __content: C };
};

type ResolveChildren<C> =
    C extends readonly ContentType[]
    ? AllPrimitives<C> extends true
    ? PrimitiveMap[Extract<C[number], PrimitiveType>]
    : ReactNode
    : never;

type WithChildren<TProps, TContent> =
    TContent extends readonly ContentType[]
    ? TProps & { children?: ResolveChildren<TContent> }
    : TProps;


type CreateSchemaArgs = {
    builder: {
        // No args - empty object
        (): z.ZodObject<{}> & {
            __content: undefined;
            content: ContentFn<{}>;
        };
        // With shape
        <S extends z.ZodObject>(shape: (mod: typeof import("zod/v4").default) => S): S & {
            __content: undefined;
            content: ContentFn<S['shape']>;
        };
    };
};

type CreateRenderArgs<T extends ElementInfo = ElementInfo> =
    ResultType<T['schema']> extends infer U extends z.ZodObject
    ? U extends { __content: infer C }
    ? WithChildren<Omit<z.output<U>, 'content'>, C>
    : Omit<z.output<U>, 'content'>
    : never;

export type ElementInfo<S extends z.ZodObject = z.ZodObject> = {
    schema: (args: CreateSchemaArgs) => S;
    default: (args: CreateRenderArgs<ElementInfo<S>>) => ReactNode;
};

export type GetAnnotations<T extends ElementInfo> = {
    SchemaArgs: CreateSchemaArgs;
    RenderArgs: CreateRenderArgs<T>;
};