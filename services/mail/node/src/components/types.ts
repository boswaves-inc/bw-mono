import z from "zod/v4";
import { ReactNode } from "react";
import { ElementType } from "../../+elements";

type ResultType<T> = T extends (...args: any) => any ? Awaited<ReturnType<T>> : never;

type PrimitiveMap = {
    string: string;
    number: number;
    boolean: boolean;
};

type PrimitiveType = keyof PrimitiveMap;
type Primitive = PrimitiveMap[PrimitiveType]

type ContentType = ElementType | PrimitiveType;
type ContentNode<T extends ContentType = ContentType> =
    T extends PrimitiveType
    ? PrimitiveMap[T]
    : T extends ElementType
    ? ({ type: T } & Record<string, unknown>)
    : never;

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

type ChildrenFromNode<N> =
    Exclude<N, Primitive> extends never ? N : ReactNode;

type ContentFn<S extends z.ZodRawShape> = {
    (): z.ZodObject<S & { content: z.ZodType<ContentNode[]> }> & { __content: readonly ContentType[] };
    <const C extends readonly ContentType[]>(
        types: C
    ): z.ZodObject<S & { content: z.ZodType<ContentNode<C[number]>[]> }> & { __content: C };
};

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
    ? U extends z.ZodObject<infer Shape>
    ? Shape extends { content: z.ZodType<infer Arr> }
    ? Arr extends Array<infer Node>
    ? Normalize<Omit<z.output<U>, "content">> & { children?: ChildrenFromNode<Node> }
    : Normalize<Omit<z.output<U>, "content">>
    : Normalize<Omit<z.output<U>, "content">>
    : never
    : never;

type ElementInfo<S extends z.ZodObject = z.ZodObject> = {
    schema: (args: CreateSchemaArgs) => S;
    default: (args: CreateRenderArgs<ElementInfo<S>>) => ReactNode;
};

type GetAnnotations<T extends ElementInfo> = {
    SchemaArgs: CreateSchemaArgs;
    RenderArgs: CreateRenderArgs<T>;
};


export {
    GetAnnotations,
    ElementInfo,
}