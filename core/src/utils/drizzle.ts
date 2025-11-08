import {
    sql,
    type AnyColumn,
    type SQL,
    type InferSelectModel,
    is,
    type SelectedFields,
    type GetColumnData,
    and
} from "drizzle-orm";
import {
    type PgTable,
    type TableConfig,
    PgTimestampString
} from "drizzle-orm/pg-core";
import type { SelectResultFields } from "drizzle-orm/query-builders/select.types";

// export function jsonBuildObject<T extends SelectedFields<any, any>>(shape: T) {
//     const chunks: SQL[] = [];

//     Object.entries(shape).forEach(([key, value]) => {
//         if (chunks.length > 0) {
//             chunks.push(sql.raw(`,`));
//         }

//         chunks.push(sql.raw(`'${key}',`));

//         // json_build_object formats to ISO 8601 ...
//         if (is(value, PgTimestampString)) {
//             chunks.push(sql`timezone('UTC', ${value})`);
//         } else {
//             chunks.push(sql`${value}`);
//         }
//     });

//     return sql<SelectResultFields<T>>`json_build_object(${sql.join(
//         chunks
//     )})`;
// }

// export function jsonAggBuildObject<
//     T extends SelectedFields<any, any>,
//     Column extends AnyColumn,
// >(
//     shape: T,
//     options?: { orderBy?: { colName: Column; direction: "ASC" | "DESC" } },
// ) {
//     return sql<SelectResultFields<T>[]>`coalesce(
//     json_agg(${jsonBuildObject(shape)}
//     ${options?.orderBy
//             ? sql`ORDER BY ${options.orderBy.colName} ${sql.raw(
//                 options.orderBy.direction,
//             )}`
//             : undefined
//         })
//     FILTER (WHERE ${and(
//             sql.join(
//                 Object.values(shape).map((value) => sql`${sql`${value}`} IS NOT NULL`),
//                 sql` AND `,
//             ),
//         )})
//     ,'${sql`[]`}')`;
// }

// // with filter non-null + distinct
// export function jsonAggDistinct<Column extends AnyColumn>(column: Column) {
//     return coalesce<GetColumnData<Column, "raw">[]>(
//         sql`json_agg(distinct ${sql`${column}`}) filter (where ${column} is not null)`,
//         sql`'[]'`
//     );
// }

export function coalesce<T>(value: SQL.Aliased<T> | SQL<T>, defaultValue: SQL) {
    return sql<T>`coalesce(${value}, ${defaultValue})`;
}

export const json_agg_object = <T extends Record<string, AnyColumn | SQL>>(obj: T): SQL<{ [K in keyof T]: T[K] extends AnyColumn ? GetColumnData<T[K]> : T[K] extends SQL<infer U> ? U : never }[]> => {
    const entries = Object.entries(obj).flatMap(([key, value]) => [
        sql.raw(`'${key}'`),
        value
    ]);

    return sql`json_agg(json_build_object(${sql.join(entries, sql`, `)}))`
}

export const json_build_object = <T extends Record<string, AnyColumn | SQL>>(obj: T): SQL<{ [K in keyof T]: T[K] extends AnyColumn ? GetColumnData<T[K]> : T[K] extends SQL<infer U> ? U : never }> => {
    const entries = Object.entries(obj).flatMap(([key, value]) => [
        sql.raw(`'${key}'`),
        value
    ]);

    return sql`json_build_object(${sql.join(entries, sql`, `)})`;
}

export const json_agg = <C extends AnyColumn>(column: C): SQL<GetColumnData<C>[]> => {
    return sql<GetColumnData<C>[]>`json_agg(${column})`;
}

export function filter<T>(aggr: SQL<T[]>, condition: SQL): SQL<T[]> {
    return sql`${aggr} FILTER (WHERE ${condition})`;
}
// // generalist
// export function jsonAgg<Column extends AnyColumn>(column: Column) {
//     return coalesce<GetColumnData<Column, "raw">[]>(
//         sql`json_agg(${sql`${column}`})`,
//         sql`'[]'`
//     );
// }

// function coalesce<T>(arg0: any, arg1: any) {
//     throw new Error("Function not implemented.");
// }
