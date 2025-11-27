import {  sql, type InferEnum, type InferSelectModel } from "drizzle-orm";
import {  index, pgEnum, pgTable,  unique } from "drizzle-orm/pg-core";
import { CouponApplication, CouponType, PeriodUnit, PricingModel, ScriptType, Status } from "./types";

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

export const ItemPrice = pgTable('item_price', (t) => ({
    id: t.uuid().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    item_id: t.uuid().references(() => Item.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    price: t.integer("price").notNull(),
    
    period: t.integer("period").notNull(), 
    period_unit: PeriodUnit('period_unit').notNull(),
    currency_code: t.text("currency_code").notNull(), // ISO 4217: 'USD', 'EUR', 'GBP', etc.
    pricing_model: PricingModel("pricing_model").notNull(), // Price in smallest unit

    status: Status('status').default('active').notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}), (table) => [
    // primaryKey({ columns: [table.item_id, table.currency_code, table.period_unit] }),
    index("item_price_item_idx").on(table.item_id),
    index("item_price_currency_idx").on(table.currency_code),
    index("item_price_item_currency_idx").on(table.item_id, table.currency_code, table.period, table.period_unit),
    unique('item_price_item_currency_unq').on(table.item_id, table.currency_code, table.period, table.period_unit)
]);

export const ItemCoupon = pgTable("item_coupon", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, { onDelete: 'cascade', onUpdate: 'cascade'}),
    type: CouponType("type").notNull(),
    value: t.doublePrecision("value").notNull(),
    apply_on: CouponApplication("apply_on").notNull(),
}))

export const ItemScript = pgTable("item_script", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, { onDelete: 'cascade', onUpdate: 'cascade'}),
    type: ScriptType("type").notNull(),
    uuid: t.text("uuid").unique().notNull(),
    image: t.text("image").notNull(),
    description: t.text("description").notNull(),
}), table => [
    unique('item_script_uuid_unq').on(table.uuid),
    index('item_script_uuid_idx').on(table.uuid),
    index('item_script_id_idx').on(table.id),
]);



/** https://apidocs.chargebee.com/docs/api/item_prices*/
export type ItemPrice = InferSelectModel<typeof ItemPrice>  
export type Item = InferSelectModel<typeof Item>
export type ItemType = InferEnum<typeof ItemType>
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