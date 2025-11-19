import {  sql, type InferEnum, type InferSelectModel } from "drizzle-orm";
import {  index, pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { CouponApplication, CouponType, PeriodUnit , PriceModel as PricingModel, ScriptType, Status } from "./types";

export const ItemType = pgEnum('item_type', [
    "plan",
    "coupon",
    'charge',
    'addon'
])

export const Item = pgTable("item_info", (t) => ({
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
    index("item_info_slug_idx").on(table.slug),
]);
 
export const ItemPrice = pgTable('item_price', (t) => ({
    id: t.uuid().references(() => Item.id, { 
        onDelete: 'cascade',
        onUpdate: 'cascade' 
    }).notNull(),
    uuid: t.uuid().notNull().$defaultFn(() => crypto.randomUUID()),
    price: t.integer("price").notNull(), // Price in smallest unit
    period_unit: PeriodUnit('period_unit').notNull(),
    pricing_model: PricingModel("pricing_model").notNull(), // Price in smallest unit
    currency_code: t.text("currency_code").notNull(), // ISO 4217: 'USD', 'EUR', 'GBP', etc.
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
    archived_at: t.timestamp(),
}),(table) => [
    primaryKey({ columns: [table.uuid] }),
    index("item_price_item_idx").on(table.currency_code),
    index("item_price_currency_idx").on(table.currency_code),
    index("item_price_item_currency_idx").on(table.id, table.currency_code),
]);

export const ItemScript = pgTable("item_script", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, { onDelete: 'cascade', onUpdate: 'cascade'}),
    type: ScriptType("type").notNull(),
    uuid: t.text("uuid").unique().notNull(),
    image: t.text("image").notNull(),
    description: t.text("description").notNull(),
}));

export const ItemCoupon = pgTable("item_coupon", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, { onDelete: 'cascade', onUpdate: 'cascade'}),
    type: CouponType("type").notNull(),
    value: t.doublePrecision("value").notNull(),
    apply_on: CouponApplication("apply_on").notNull(),
}))

export type Item = InferSelectModel<typeof Item>
export type ItemType = InferEnum<typeof ItemType>
export type ItemPrice = InferSelectModel<typeof ItemPrice>
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