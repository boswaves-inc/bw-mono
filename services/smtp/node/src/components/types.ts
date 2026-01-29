import z, { keyof } from "zod/v4";
import { ReactNode } from "react";
import { ElementType } from "../../+elements";

export type PrimitiveType = keyof PrimitiveMap;

export type PrimitiveMap = {
    string: string;
    number: number;
    boolean: boolean;
};

export type Primitive = { [K in PrimitiveType]: PrimitiveMap[K] }[PrimitiveType]

type ContentType = ElementType | PrimitiveType;

type ContentNode<T extends ContentType = ContentType> = { type: T } & Record<string, unknown>;

type ContentFn<S extends z.ZodRawShape> = {
    (): z.ZodObject<S & { content: z.ZodType<ContentNode[]> }> & { __content: readonly ContentType[] };
    <const C extends readonly ContentType[]>(
        types: C
    ): z.ZodObject<S & { content: z.ZodType<ContentNode<C[number]>[]> }> & { __content: C };
};

type ResultType<T> = T extends (...args: any) => any ? Awaited<ReturnType<T>> : never;

type Normalize<T> =
    T extends Record<string, never>
    ? ({
        [K in keyof T]-?:
        string extends K ? never :
        number extends K ? never :
        symbol extends K ? never :
        K
    }[keyof T] extends never ? {} : T)
    : T;

type CreateSchemaArgs = {
    builder: {
        (): z.ZodObject<{}> & { __content: undefined; content: ContentFn<{}> };
        <S extends z.ZodObject>(
            shape: (mod: typeof import("zod/v4").default) => S
        ): S & { __content: undefined; content: ContentFn<S["shape"]> };
    };
};

type CreateRenderArgs<T extends ElementInfo = ElementInfo> =
    ResultType<T["schema"]> extends infer U
    ? U extends z.ZodObject
    ? (
        U extends z.ZodObject<infer Shape>
        ? Shape extends { content: z.ZodType<ContentNode<infer NodeType>[]> }
        ? Normalize<Omit<z.output<U>, "content">> & {
            children?: Exclude<NodeType, PrimitiveType> extends never
            ? PrimitiveMap[Extract<NodeType, PrimitiveType>]
            : ReactNode;
        }
        : Normalize<Omit<z.output<U>, "content">>
        : never
    )
    : never
    : never;

export type ElementInfo<S extends z.ZodObject = z.ZodObject> = {
    schema: (args: CreateSchemaArgs) => S;
    default: (args: CreateRenderArgs<ElementInfo<S>>) => ReactNode;
};

export type GetAnnotations<T extends ElementInfo> = {
    SchemaArgs: CreateSchemaArgs;
    RenderArgs: CreateRenderArgs<T>;
};
