import { pgMaterializedView } from "drizzle-orm/pg-core";
import { Item, ItemCoupon } from "./item";
import { eq, sql } from "drizzle-orm";


export const Coupon = pgMaterializedView('coupon_info').as(qb => {
    return qb.select({
        id: Item.id,
        name: Item.name,
        status: Item.status,
        type: ItemCoupon.type,
        value: ItemCoupon.value,
        apply_on: ItemCoupon.apply_on,
        created_at: Item.created_at,
        updated_at: Item.updated_at,
        archived_at: Item.archived_at,
    })
        .from(ItemCoupon)
        .innerJoin(Item, eq(ItemCoupon.id, Item.id))
})

export type Coupon = typeof Coupon.$inferSelect