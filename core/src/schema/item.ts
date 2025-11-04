import type { InferEnum } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { Status } from "./types";

// export const PeriodUnit = pgEnum('period_unit', [
//     "day",
//     "week",
//     "month",
//     "year"
// ])

export const Item = pgTable("item_info", (t) => ({
    id: t.uuid().primaryKey().notNull(),
    title: t.text().notNull(),
    status: Status().default('pending').notNull()
}));


// export const ItemPrice = pgTable("item_price", (t) => ({
//     id: t.uuid().primaryKey().references(() => Item.id, {
//         onUpdate: 'cascade',
//         onDelete: 'cascade'
//     }),
    
//     price: t.numeric(),
//     currncy: t.text(),
//     period: PeriodUnit().notNull(),
// }));

// export type ItemType = InferEnum<typeof ItemType>
// export type PeriodUnit = InferEnum<typeof PeriodUnit>