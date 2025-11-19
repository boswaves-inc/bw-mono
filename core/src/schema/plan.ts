import { index, pgEnum, pgMaterializedView, pgTable, pgView, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { Item,  PlanScript } from "./item";
import { eq, isNotNull, type InferEnum, type InferSelectModel, } from "drizzle-orm";
import { array_agg, json_agg, json_agg_object, json_build_object } from "../utils/drizzle";
import { PeriodUnit, PricingModel } from "./types";

export const PlanPrice = pgTable('item_plan_price', (t) => ({
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
    index("plan_price_item_idx").on(table.currency_code),
    index("plan_price_currency_idx").on(table.currency_code),
    index("plan_price_item_currency_idx").on(table.id, table.currency_code),
]);

export const PlanData = pgMaterializedView('plan_data').as(qb => {
    return qb.select({
        id: Item.id,
        name: Item.name,
        type: Item.type,
        slug: Item.slug,
        status: Item.status,
        script: json_build_object({
            id: PlanScript.id,
            uuid: PlanScript.uuid,
            type: PlanScript.type,
            image: PlanScript.image,
            description: PlanScript.description
        }).as('script'),
        prices: json_agg_object({
            id: PlanPrice.id,
            uuid: PlanPrice.uuid,
            price: PlanPrice.price,
            period_unit: PlanPrice.period_unit,
            pricing_model: PlanPrice.pricing_model,
            currency_code: PlanPrice.currency_code,
            created_at: PlanPrice.created_at,
            updated_at: PlanPrice.updated_at,
            archived_at: PlanPrice.archived_at,
        }).as('prices'),
        created_at: Item.created_at,
        updated_at: Item.updated_at,
        archived_at: Item.archived_at,
    })
        .from(Item)
        .leftJoin(PlanScript, eq(PlanScript.id, Item.id))
        .leftJoin(PlanPrice, eq(PlanPrice.id, Item.id))
        .where(eq(Item.type, 'plan'))
        .groupBy(Item.id, PlanScript.id)
})


export type PlanData = typeof PlanData.$inferSelect
export type PlanPrice = InferSelectModel<typeof PlanPrice>
