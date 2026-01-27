import z from "zod/v4";
import { PropsWithChildren, ReactNode } from "react";
import { ElementType } from "../../+elements";

type ResultType<T> = T extends (...args: any) => any
    ? Awaited<ReturnType<T>>
    : never;

type ContentNode<T extends ElementType = ElementType> = {
    type: T;
} & Record<string, unknown>;

type CreateSchemaArgs<T extends ElementInfo = ElementInfo> = {
    content: {
        (): z.ZodType<ContentNode<ElementType>[]>;
        <const T extends readonly ElementType[]>(allowed: T): z.ZodType<ContentNode<T[number]>[]>;
    };
};

type CreateRenderArgs<T extends ElementInfo = ElementInfo> = ResultType<T['schema']> extends infer U extends z.ZodObject
    ? PropsWithChildren<Omit<z.output<U>, 'content'>>
    : never

export type ElementInfo<S extends z.ZodObject = z.ZodObject> = {
    schema: (args: CreateSchemaArgs<ElementInfo<S>>) => S;
    default: (args: CreateRenderArgs<ElementInfo<S>>) => ReactNode;
};

export type GetAnnotations<T extends ElementInfo> = {
    SchemaArgs: CreateSchemaArgs<T>;
    RenderArgs: CreateRenderArgs<T>;
};