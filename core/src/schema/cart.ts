import { User } from "./user";
import { Item, ItemType } from "./item";
import { pgTable, pgView, primaryKey } from "drizzle-orm/pg-core";
import { eq, max, sql, type InferSelectModel, type InferSelectViewModel } from "drizzle-orm";
import { coalesce, filter, json_agg_object } from "../utils/drizzle";
import { CouponData } from "./coupon";
import { ScriptData } from "./script";

export const Cart = pgTable("cart_info", (t) => ({
    id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    uid: t.uuid().references(() => User.uid, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}));

export const CartItem = pgTable("cart_item", (t) => ({
    cart_id: t.uuid().references(() => Cart.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    item_id: t.uuid().references(() => Item.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    item_type: ItemType('item_type').notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}), ({ cart_id, item_id }) => [
    primaryKey({ columns: [cart_id, item_id] }),
]);

export const CartData = pgView('cart_data').as(qb => {
    return qb.select({
        id: Cart.id,
        uid: Cart.uid,
        items: coalesce(
            filter(
                json_agg_object({
                    id: ScriptData.id,
                    uuid: ScriptData.uuid,
                    type: ScriptData.type,
                    name: ScriptData.name,
                    slug: ScriptData.slug,
                    status: ScriptData.status,
                    image: ScriptData.image,
                    description: ScriptData.description,
                    created_at: ScriptData.created_at,
                    updated_at: ScriptData.updated_at,
                    archived_at: ScriptData.archived_at,
                }),
                eq(CartItem.item_type, 'script')
            ), sql`'[]'::json`
        ).as('items'),
        coupons: coalesce(
            filter(
                json_agg_object({
                    id: CouponData.id,
                    name: CouponData.name,
                    status: CouponData.status,
                    type: CouponData.type,
                    value: CouponData.value,
                    apply_on: CouponData.apply_on,
                    created_at: CouponData.created_at,
                    updated_at: CouponData.updated_at,
                    archived_at: CouponData.archived_at,
                }),
                eq(CartItem.item_type, 'coupon')
            ), sql`'[]'::json`
        ).as('coupons'),
        created_at: Cart.created_at,
        updated_at: max(CartItem.updated_at).as('updated_at')
    })
        .from(Cart)
        .innerJoin(CartItem, eq(CartItem.cart_id, Cart.id))
        .leftJoin(ScriptData, eq(CartItem.item_id, ScriptData.id))
        .leftJoin(CouponData, eq(CartItem.item_id, CouponData.id))
        .groupBy(Cart.id)
})

export type Cart = InferSelectModel<typeof Cart>
export type CartItem = InferSelectModel<typeof CartItem>
export type CartData = InferSelectViewModel<typeof CartData>
