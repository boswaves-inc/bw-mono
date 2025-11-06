import { sql, type InferSelectModel } from "drizzle-orm";
import {  pgTable } from "drizzle-orm/pg-core";
import { CouponApplication, CouponType, ScriptType, Status } from "./types";

// export const PeriodUnit = pgEnum('period_unit', [
//     "day",
//     "week",
//     "month",
//     "year"
// ])

export const Item = pgTable("item_info", (t) => ({
    id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    name: t.text("name").unique().notNull(),
    status: Status("status").default('archived').notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
    archived_at: t.timestamp(),
}));

export const ItemScript = pgTable("item_script", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, { onDelete: 'cascade', onUpdate: 'cascade'}),
    uuid: t.text("uuid").unique().notNull(),
    type: ScriptType("type").notNull(),

}));

export const ItemCoupon = pgTable("item_coupon", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, { onDelete: 'cascade', onUpdate: 'cascade'}),
    type: CouponType("type").notNull(),
    value: t.doublePrecision("value").notNull(),
    apply_on: CouponApplication("apply_on").notNull(),
}))

export type Item = InferSelectModel<typeof Item>
export type ItemScript = InferSelectModel<typeof ItemScript>
export type ItemCoupon = InferSelectModel<typeof ItemCoupon>

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