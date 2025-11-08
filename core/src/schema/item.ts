import { sql, type InferEnum, type InferSelectModel } from "drizzle-orm";
import {  index, pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { CouponApplication, CouponType, ScriptType, Status } from "./types";

export const ItemType = pgEnum('item_type', [
    "script",
    "coupon"
])

export const Item = pgTable("item_info", (t) => ({
    id: t.uuid().notNull().$defaultFn(() => crypto.randomUUID()),
    type: ItemType('type').default('script').notNull(),
    name: t.text("name").unique().notNull(),
    slug: t.text("slug").unique().notNull().generatedAlwaysAs(
        sql`lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))`
    ),
    status: Status("status").default('archived').notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
    archived_at: t.timestamp(),
}), table => [
    primaryKey({columns: [table.id]}),
    index("item_info_slug_idx").on(table.slug),
]);
 
export const ItemPrice = pgTable('item_price', (t) => ({
    id: t.uuid().references(() => Item.id, { 
        onDelete: 'cascade',
        onUpdate: 'cascade' 
    }).notNull(),
    currency: t.text("currency").notNull(), // ISO 4217: 'USD', 'EUR', 'GBP', etc.
    price_cents: t.integer("price_cents").notNull(), // Price in smallest unit
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}),(table) => [
    primaryKey({ columns: [table.id, table.currency] }),
    index("item_price_currency_idx").on(table.currency),
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