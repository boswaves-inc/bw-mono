import { pgMaterializedView, pgTable } from "drizzle-orm/pg-core";
import { Item } from "./item";
import { eq, sql, type InferSelectModel } from "drizzle-orm";
import { CouponApplication, CouponType } from "./types";

export const CouponInfo = pgTable("item_coupon", (t) => ({
    id: t.uuid().primaryKey().references(() => Item.id, { onDelete: 'cascade', onUpdate: 'cascade'}),
    type: CouponType("type").notNull(),
    value: t.doublePrecision("value").notNull(),
    apply_on: CouponApplication("apply_on").notNull(),
}))

export const CouponData = pgMaterializedView('coupon_data').as(qb => {
    return qb.select({
        id: Item.id,
        name: Item.name,
        status: Item.status,
        type: CouponInfo.type,
        value: CouponInfo.value,
        apply_on: CouponInfo.apply_on,
        created_at: Item.created_at,
        updated_at: Item.updated_at,
        archived_at: Item.archived_at,
    })
        .from(CouponInfo)
        .innerJoin(Item, eq(CouponInfo.id, Item.id))
})

export type CouponInfo = InferSelectModel<typeof CouponInfo>
export type CouponData = typeof CouponData.$inferSelect