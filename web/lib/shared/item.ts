import type { InferEnum } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const PeriodUnit = pgEnum('period_unit', [
    "day",
    "week",
    "month",
    "year"
])

export const ItemType = pgEnum('item_type', [
    'script'
])

// export const Script = pgTable("script_info", (t) => ({
//     id: t.uuid().primaryKey().defaultRandom().notNull(),
//     script_id: t.varchar({ length: 255 }).notNull(),
// }));

export const Item = pgTable("item_info", (t) => ({
    id: t.uuid().primaryKey().notNull(),
    price: t.numeric(),
    currncy: t.text(),
    period: PeriodUnit().notNull(),
}));

export const ItemPrice = pgTable("item_price", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade'
    }),
    
    price: t.numeric(),
    currncy: t.text(),
    period: PeriodUnit().notNull(),
}));

// export type ItemType = InferEnum<typeof ItemType>
export type PeriodUnit = InferEnum<typeof PeriodUnit>