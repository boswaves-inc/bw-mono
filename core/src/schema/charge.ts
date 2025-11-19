import { index, pgMaterializedView, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { Item } from "./item";
import { eq, sql } from "drizzle-orm";
import { json_agg_object } from "../utils/drizzle";
import { PricingModel } from "./types";

export const ChargePrice = pgTable('item_charge_price', (t) => ({
    id: t.uuid().references(() => Item.id, { 
        onDelete: 'cascade',
        onUpdate: 'cascade' 
    }).notNull(),
    uuid: t.uuid().notNull().$defaultFn(() => crypto.randomUUID()),
    price: t.integer("price").notNull(), // Price in smallest unit
    pricing_model: PricingModel("pricing_model").notNull(), // Price in smallest unit
    currency_code: t.text("currency_code").notNull(), // ISO 4217: 'USD', 'EUR', 'GBP', etc.
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
    archived_at: t.timestamp(),
}),(table) => [
    primaryKey({ columns: [table.uuid] }),
    index("charge_price_item_idx").on(table.currency_code),
    index("charge_price_currency_idx").on(table.currency_code),
    index("charge_price_item_currency_idx").on(table.id, table.currency_code),
]);

export const ChargeData = pgMaterializedView('charge_data').as(qb => {
    return qb.select({
        id: Item.id,
        name: Item.name,
        status: Item.status,
        prices: json_agg_object({
            id: ChargePrice.id,
            uuid: ChargePrice.uuid,
            price: ChargePrice.price,
            pricing_model: ChargePrice.pricing_model,
            currency_code: ChargePrice.currency_code,
            created_at: ChargePrice.created_at,
            updated_at: ChargePrice.updated_at,
            archived_at: ChargePrice.archived_at,
        }).as('prices'),
        created_at: Item.created_at,
        updated_at: Item.updated_at,
        archived_at: Item.archived_at,
    })
        .from(Item)
        .leftJoin(ChargePrice, eq(ChargePrice.id, Item.id))
        .where(eq(Item.type, 'charge'))
        .groupBy(Item.id)
})

export type ChargeData = typeof ChargeData.$inferSelect
export type ChargePrice = typeof ChargePrice.$inferSelect