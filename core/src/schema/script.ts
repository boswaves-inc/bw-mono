import { index, pgMaterializedView, pgView, uniqueIndex } from "drizzle-orm/pg-core";
import { Item, ItemScript } from "./item";
import { eq, } from "drizzle-orm";

export const Script = pgMaterializedView('script_info').as(qb => {
    return qb.select({
        id: Item.id,
        uuid: ItemScript.uuid,
        title: Item.title,
        status: Item.status,
        created_at: ItemScript.created_at,
        updated_at: ItemScript.updated_at
    })
        .from(ItemScript)
        .innerJoin(Item, eq(ItemScript.id, Item.id))
})

export type Script = typeof Script.$inferSelect