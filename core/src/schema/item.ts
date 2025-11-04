import type { InferEnum, InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { Status } from "./types";
import { createInsertSchema } from "drizzle-zod";

// export const PeriodUnit = pgEnum('period_unit', [
//     "day",
//     "week",
//     "month",
//     "year"
// ])

export const Item = pgTable("item_info", (t) => ({
    id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    title: t.text("title").unique().notNull(),
    status: Status().default('archived').notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull()
}));

export const ItemScript = pgTable("item_script", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, { onDelete: 'cascade', onUpdate: 'cascade'}),
    uuid: t.text("uuid").unique().notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull()
}));

export type Item = InferSelectModel<typeof Item>
export type ItemScript = InferSelectModel<typeof ItemScript>

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