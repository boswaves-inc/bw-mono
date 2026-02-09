import z from "zod/v4";
import { element_map } from "virtual:smtp/elements";
import { ElementType, PrimitiveType, Primitive } from "../../+elements";

export { element_map as elements }

const primitives = {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
} as const;

const keys = [
    ...Object.keys(primitives),
    ...Object.keys(element_map),
];

const cache = new Map<string, z.ZodLazy<z.ZodObject<any>>>();

const isElement = (type: string): type is ElementType => {
    return type in element_map;
};

const isPrimitive = (type: string): type is PrimitiveType => {
    return type in primitives;
};

const unionArray = <T>(xs: T[]): [T, ...T[]] => {
    if (xs.length === 0) {
        throw new Error("discriminatedUnion needs at least one option");
    }
    return xs as [T, ...T[]];
};

const content = (filter: readonly string[]) => {
    const primitiveTypes = filter.filter(isPrimitive);
    const elementTypes = filter.filter(isElement);

    // Only primitives => array of primitives (string|number|boolean filtered)
    if (elementTypes.length === 0 && primitiveTypes.length > 0) {
        const primitiveSchemas = primitiveTypes.map((t) => primitives[t]);

        const node =
            primitiveSchemas.length === 1
                ? primitiveSchemas[0]
                : z.union(unionArray(primitiveSchemas));

        return z.array(node);
    }

    // Only elements => array of discriminated element objects
    if (primitiveTypes.length === 0 && elementTypes.length > 0) {
        const schemas = elementTypes.map(element);
        return z.array(
            z.discriminatedUnion("type", unionArray(schemas)) as unknown as z.ZodType<Element>
        );
    }

    // Mixed => array of (primitive | element-object)
    if (primitiveTypes.length > 0 && elementTypes.length > 0) {
        const primitiveSchemas = primitiveTypes.map((t) => primitives[t]);
        const elementSchemas = elementTypes.map(element);

        return z.array(
            z.union(unionArray([...primitiveSchemas, ...elementSchemas])) as any as z.ZodType<Element | Primitive>
        );
    }

    // No allowed types
    return z.array(z.never());
};

const builder = <S extends z.ZodObject = z.ZodObject<{}>>(shape?: (zod: typeof z) => S) => {
    const schema = shape ? shape(z) : (z.object({}) as S);

    const inner = (filter?: readonly string[]) => {
        const types = filter ?? keys;
        const ext = content(types);

        return Object.assign(schema.extend({ content: ext }), {
            __content: types,
        });
    };

    return Object.assign(schema, {
        __content: undefined as undefined,
        content: inner,
    });
}

export const href = () => z.object({
    href: z.string().optional(),
    target: z.enum([
        "_self",
        "_blank",
        "_parent",
        "_top",
    ]).optional(),
});

export function element(): z.ZodType<Element, unknown, z.core.$ZodTypeInternals<Element, unknown>>
export function element(type: keyof typeof element_map): z.ZodLazy<z.ZodObject<any, z.core.$strip>>
export function element(type?: keyof typeof element_map) {
    if (type == undefined) {
        const schemas = Object.keys(element_map).map(element);

        return z.discriminatedUnion("type", unionArray(schemas)) as unknown as z.ZodType<Element>;
    }

    const cached = cache.get(type as string);

    if (cached != undefined) {
        return cached
    }

    const schema = z.lazy(() => {
        const element = element_map[type];

        // Fallback for unknown element modules
        if (!element?.schema) {
            // NOTE: if you want unknown elements to still accept content, add it here
            return z.object({ type: z.literal(type) });
        }

        // element.schema({ builder }) should return a ZodObject
        return element.schema({ builder }).extend({ type: z.literal(type) });
    });

    cache.set(type as string, schema)[type];

    return schema;
};

// export const element = () => {
//     const schemas = Object.keys(element_map).map(getElementSchema);

//     return z.discriminatedUnion("type", unionArray(schemas)) as unknown as z.ZodType<Element>;
// };