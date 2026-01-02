import type { UnionToIntersection } from "@tanstack/react-table";
import type { Primitive } from "react-hook-form";

export type FlattenObject<T, Prefix extends string = ""> = T extends Primitive
    ? { [P in Prefix]: T }
    : T extends readonly (infer U)[]
    ? { [P in Prefix]: T }
    : T extends object
    ? UnionToIntersection<{
        [K in keyof T]-?: K extends string | number
        ? Prefix extends ""
        ? FlattenObject<T[K], `${K}`>
        : FlattenObject<T[K], `${Prefix}.${K}`>
        : never;
    }[keyof T]>
    : { [P in Prefix]: T };


export const flattenObject =<T extends Record<string, any>>(obj: T, prefix: string = ""): any => {
    const result: Record<string, any> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            const newKey = prefix ? `${prefix}.${key}` : key;

            // Check if value is a primitive, null, undefined, Date, RegExp, Function, or Array
            if (
                value === null ||
                value === undefined ||
                value === null ||
                value === undefined ||
                typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean' ||
                typeof value === 'function' ||
                Array.isArray(value) ||
                (value && typeof value === 'object' && value.constructor === Date) ||
                (value && typeof value === 'object' && value.constructor === RegExp)
            ) {
                result[newKey] = value;
            }
            // If it's a plain object, recurse
            else if (
                typeof value === 'object' &&
                value.constructor === Object
            ) {
                Object.assign(result, flattenObject(value, newKey));
            }
            // For other object types (custom classes, etc.), preserve as-is
            else {
                result[newKey] = value;
            }
        }
    }

    return result as FlattenObject<T>;
}

