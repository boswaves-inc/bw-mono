import z from "zod/v4";
import { ReactNode } from "react";
import { ElementType as ComponentType } from "../../+elements";

type PrimitiveMap = {
    string: string;
    number: number;
    boolean: boolean;
};

type PrimitiveType = keyof PrimitiveMap;

type ElementType = ComponentType | PrimitiveType;

type ResultType<T> = T extends (...args: any) => any
    ? Awaited<ReturnType<T>>
    : never;

type ContentNode<T extends ElementType = ElementType> = {
    type: T;
} & Record<string, unknown>;

type AllPrimitives<C extends readonly ElementType[]> =
    Exclude<C[number], PrimitiveType> extends never ? true : false;

type ResolveChildren<C> =
    C extends readonly ElementType[]
    ? AllPrimitives<C> extends true
    ? PrimitiveMap[Extract<C[number], PrimitiveType>]
    : ReactNode
    : never;

type WithChildren<TProps, TContent> =
    TContent extends readonly ElementType[]
    ? TProps & { children?: ResolveChildren<TContent> }
    : TProps;


type CreateSchemaArgs = {
    builder: {
        <S extends z.ZodObject>(shape: S): S & {
            __content: undefined;
            content: {
                (): z.ZodObject<S['shape'] & { content: z.ZodType<ContentNode[]> }> & { __content: readonly ElementType[] };
                <const C extends readonly ElementType[]>(types: C): z.ZodObject<S['shape'] & { content: z.ZodType<ContentNode<C[number]>[]> }> & { __content: C };
            };
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