import { index, pgEnum, pgMaterializedView, pgView, uniqueIndex } from "drizzle-orm/pg-core";
import { Item, ItemScript } from "./item";
import { eq, type InferEnum, } from "drizzle-orm";

export const ScriptData = pgMaterializedView('script_data').as(qb => {
    return qb.select({
        id: Item.id,
        uuid: ItemScript.uuid,
        type: ItemScript.type,
        name: Item.name,
        slug: Item.slug,
        status: Item.status,
        image: ItemScript.image,
        description: ItemScript.description,
        created_at: Item.created_at,
        updated_at: Item.updated_at,
        archived_at: Item.archived_at,
    })
        .from(ItemScript)
        .innerJoin(Item, eq(ItemScript.id, Item.id))
})

export type ScriptData = typeof ScriptData.$inferSelect