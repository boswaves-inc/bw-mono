import z, { never, ZodType } from "zod/v4";
import { elements } from "virtual:smtp/elements";

// type NodeShape<K extends keyof ElementModules> = ResultType<ElementModules[K]['schema']>

// type NodeDef<T extends keyof ElementModules, S extends z.ZodObject> = z.ZodObject<S['shape'] & { type: z.ZodLiteral<T> }>

// type Node = { [K in keyof ElementModules]: z.output<NodeDef<K, NodeShape<K>>> }[keyof ElementModules]

// type Primitive = z.output<ResultType<typeof primitive>>

// type Content = Primitive | Node | Content[];

// type Node = ElementDef<  z.output<ResultType<ElementModules[keyof ElementModules]['schema']>>

export const unionArray = <T>(xs: T[]): [T, ...T[]] => {
    if (xs.length === 0) {
        throw new Error("discriminatedUnion needs at least one option")
    }

    return xs as [T, ...T[]]
}

export const href = () => z.object({
    href: z.string().optional(),
    target: z.enum([
        "_self",
        "_blank",
        "_parent",
        "_top",
    ]).optional()
})

export const primitive = () => z.union([
    z.string(),
    z.number(),
])

// export const content = () => z.lazy(() => {
//     return z.union([
//         z.discriminatedUnion('type', unionArray(elements.map(x => x.module.schema({})))),
//         z.array(content())
//     ])
// })


// export const createSchemaBuilder = (contentFn: ContentFn): SchemaBuilder => {
//     return (<TShape extends z.ZodRawShape, TContent extends readonly ElementType[]>(
//         shape: TShape,
//         contentTypes?: TContent
//     ) => {
//         if (contentTypes) {
//             return Object.assign(
//                 z.object({ ...shape, content: contentFn(contentTypes) }),
//                 { __contentTypes: contentTypes }
//             );
//         }
//         return Object.assign(
//             z.object(shape),
//             { __contentTypes: undefined }
//         );
//     }) as SchemaBuilder;
// };
