import {  sql, type InferEnum, type InferSelectModel } from "drizzle-orm";
import {  index, pgEnum, pgTable, primaryKey, unique } from "drizzle-orm/pg-core";
import { CouponApplication, CouponType, PeriodUnit , PricingModel, ScriptType, Status } from "./types";

export const ItemType = pgEnum('item_type', [
    "plan",
    "coupon",
    'charge',
    'addon'
])

export const Item = pgTable("item", (t) => ({
    id: t.uuid().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    type: ItemType('type').notNull(),
    name: t.text("name").unique().notNull(),
    slug: t.text("slug").unique().notNull().generatedAlwaysAs(
        sql`lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))`
    ),
    status: Status("status").default('archived').notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
    archived_at: t.timestamp(),
}), table => [
    unique('item_info_id_type_unq').on(table.id, table.type),
    index("item_info_slug_idx").on(table.slug),
]);
 
export const PlanScript = pgTable("item_plan_script", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, { onDelete: 'cascade', onUpdate: 'cascade'}),
    type: ScriptType("type").notNull(),
    uuid: t.text("uuid").unique().notNull(),
    image: t.text("image").notNull(),
    description: t.text("description").notNull(),
}));

// export const ItemCoupon = pgTable("item_coupon", (t) => ({
//     id: t.uuid().primaryKey().references(() => Item.id, { onDelete: 'cascade', onUpdate: 'cascade'}),
//     type: CouponType("type").notNull(),
//     value: t.doublePrecision("value").notNull(),
//     apply_on: CouponApplication("apply_on").notNull(),
// }))

export type Item = InferSelectModel<typeof Item>
export type ItemType = InferEnum<typeof ItemType>
export type PlanScript = InferSelectModel<typeof PlanScript>

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