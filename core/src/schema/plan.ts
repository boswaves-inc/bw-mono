import { index, pgEnum, pgMaterializedView, pgView, uniqueIndex } from "drizzle-orm/pg-core";
import { Item, ItemPrice, ItemScript } from "./item";
import { eq, isNotNull, type InferEnum, } from "drizzle-orm";
import { array_agg, json_agg, json_agg_object, json_build_object } from "../utils/drizzle";

export const PlanData = pgMaterializedView('plan_data').as(qb => {
    return qb.select({
        id: Item.id,
        name: Item.name,
        slug: Item.slug,
        status: Item.status,
        script: json_build_object({
            id: ItemScript.id,
            uuid: ItemScript.uuid,
            type: ItemScript.type,
            image: ItemScript.image,
            description: ItemScript.description
        }).as('script'),
        prices: json_agg_object({
            id: ItemPrice.id,
            uuid: ItemPrice.uuid,
            price: ItemPrice.price,
            period_unit: ItemPrice.period_unit,
            pricing_model: ItemPrice.pricing_model,
            currency_code: ItemPrice.currency_code,
            created_at: ItemPrice.created_at,
            updated_at: ItemPrice.updated_at,
            archived_at: ItemPrice.archived_at,
        }).as('prices'),
        created_at: Item.created_at,
        updated_at: Item.updated_at,
        archived_at: Item.archived_at,
    })
        .from(Item)
        .leftJoin(ItemScript, eq(ItemScript.id, Item.id))
        .leftJoin(ItemPrice, eq(ItemPrice.id, Item.id))
        .where(eq(Item.type, 'plan'))
        .groupBy(Item.id, ItemScript.id)
})


export type PlanData = typeof PlanData.$inferSelect