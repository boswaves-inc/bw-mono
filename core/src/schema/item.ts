import { ne, sql, type InferEnum, type InferSelectModel } from "drizzle-orm";
import { index, pgEnum, pgTable, unique, uniqueIndex } from "drizzle-orm/pg-core";
import { citext, PeriodUnit, PricingModel, ScriptType, Status } from "./types";

export const ItemType = pgEnum('item_type', [
    "plan",
    "coupon",
    'charge',
    'addon'
])

export const Item = pgTable("item", (t) => ({
    id: t.uuid().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    type: ItemType('type').notNull(),
    name: t.text("name").notNull(),
    slug: t.text("slug").unique().notNull().generatedAlwaysAs(
        sql`lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))`
    ),
    status: Status("status").notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull()
}), table => [
    uniqueIndex("item_info_slug_unq").on(table.slug),
    uniqueIndex("item_info_name_unq").on(table.name).where(sql`status != 'deleted'`),
    uniqueIndex('item_info_id_type_unq').on(table.id, table.type).where(sql`status != 'deleted'`),
]);

export const ItemPrice = pgTable('item_price', (t) => ({
    id: t.uuid().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    item_id: t.uuid().references(() => Item.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    price: t.integer("price").notNull(),
    name: t.text("name").notNull(),
    period: t.integer("period").notNull(),
    period_unit: PeriodUnit('period_unit').notNull(),
    currency_code: t.text("currency_code").notNull(), // ISO 4217: 'USD', 'EUR', 'GBP', etc.
    pricing_model: PricingModel("pricing_model").notNull(), // Price in smallest unit
    status: Status('status').notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}), (table) => [
    uniqueIndex("item_price_name_unq").on(table.name).where(sql`status != 'deleted'`),
    uniqueIndex('item_price_item_currency_idx').on(table.item_id, table.currency_code, table.period, table.period_unit).where(sql`status != 'deleted'`),
    index("item_price_currency_idx").on(table.currency_code),
    index("item_price_item_idx").on(table.item_id),
]);

export const ItemScript = pgTable("item_script", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    type: ScriptType("type").notNull(),
    uuid: t.text("uuid").unique().notNull(),
    image: t.text("image").notNull(),
    description: t.text("description").notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}), table => [
    unique('item_script_uuid_unq').on(table.uuid),
    index('item_script_uuid_idx').on(table.uuid),
    index('item_script_id_idx').on(table.id),
]);

export const ItemTag = pgTable("item_tag", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    item_id: t.uuid().references(() => Item.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    value: citext().notNull(),
    status: Status('status').notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull()
}), table => [
    index('item_tag_id_idx').on(table.id),
    index('item_tag_value_idx').on(table.value),
    uniqueIndex('item_tag_value_unq').on(table.id, table.value),
]);

export type ItemType = InferEnum<typeof ItemType>

/** https://apidocs.chargebee.com/docs/api/item_prices */
export type ItemPrice = InferSelectModel<typeof ItemPrice>

/** https://apidocs.chargebee.com/docs/api/items */
export type Item = InferSelectModel<typeof Item>

/** Tradingview Script */
export type ItemScript = InferSelectModel<typeof ItemScript>

/** Item Tag */
export type ItemTag = InferSelectModel<typeof ItemTag>
