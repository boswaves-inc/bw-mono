import z from "zod/v4";
import { element_map } from "virtual:smtp/elements";
import { PrimitiveType } from "./types";
import { ElementType } from "../../+elements";

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

const getElementSchema = (type: string) => {
    if (cache.has(type)) {
        return cache.get(type)!;
    }

    // Cache BEFORE creating lazy inner function
    const lazySchema = z.lazy(() => {
        const element = element_map[type];

        if (!element?.schema) {
            return z.object({ type: z.literal(type) });
        }

        return element.schema({ builder }).extend({ type: z.literal(type) });
    });

    cache.set(type, lazySchema);
    return lazySchema;
};

const content = (filter: readonly string[]) => {
    const primitiveTypes = filter.filter(isPrimitive);
    const elementTypes = filter.filter(isElement);

    if (elementTypes.length === 0 && primitiveTypes.length > 0) {
        const primitiveSchemas = primitiveTypes.map(type => primitives[type]);

        return primitiveSchemas.length === 1
            ? primitiveSchemas[0]
            : z.union(unionArray(primitiveSchemas));
    }

    if (primitiveTypes.length === 0 && elementTypes.length > 0) {
        const schemas = elementTypes.map(getElementSchema);

        return z.array(
            z.discriminatedUnion('type', unionArray(schemas))
        );
    }

    if (primitiveTypes.length > 0 && elementTypes.length > 0) {
        const primitiveSchemas = primitiveTypes.map(type => primitives[type]);
        const elementSchemas = elementTypes.map(getElementSchema);

        return z.array(z.union(unionArray([...primitiveSchemas, ...elementSchemas])));
    }

    return z.array(z.never());
};

const builder = <S extends z.ZodObject = z.ZodObject<{}>>(shape?: (zod: typeof z) => S) => {
    const schema = shape ? shape(z) : z.object({}) as S;

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
};

export const unionArray = <T>(xs: T[]): [T, ...T[]] => {
    if (xs.length === 0) {
        throw new Error("discriminatedUnion needs at least one option");
    }
    return xs as [T, ...T[]];
};

export const href = () => z.object({
    href: z.string().optional(),
    target: z.enum([
        "_self",
        "_blank",
        "_parent",
        "_top",
    ]).optional(),
});

export const element = () => {
    const schemas = Object.keys(element_map).map(getElementSchema);

    return z.discriminatedUnion('type', unionArray(schemas))
};

export { builder };