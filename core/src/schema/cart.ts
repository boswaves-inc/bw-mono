import { User } from "./user";
import { Item, ItemScript, ItemType } from "./item";
import { foreignKey, pgTable, pgView, primaryKey } from "drizzle-orm/pg-core";
import { eq, max, or, sql, type InferSelectModel, type InferSelectViewModel } from "drizzle-orm";
import { json_agg_object } from "../utils/drizzle";

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
    id: t.uuid().references(() => Cart.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    type: ItemType('type').notNull(),
    item: t.uuid().references(() => Item.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}), ({ id, item, type }) => [
    primaryKey({ columns: [id, item] }),
    foreignKey({
        columns: [item, type],
        foreignColumns: [Item.id, Item.type]
    }).onDelete('cascade').onUpdate('cascade'),
]);

export const CartData = pgView('cart_data').as(qb => {
    return qb.select({
        id: Cart.id,
        uid: Cart.uid,
        items: json_agg_object({
            id: Item.id,
            name: Item.name,
            type: Item.type,
            slug: Item.slug,
            status: Item.status,
            created_at: Item.created_at,
            updated_at: Item.updated_at,
            archived_at: Item.archived_at,
        }).as('items')
    }).from(Cart)
        .leftJoin(CartItem, eq(Cart.id, CartItem.id))
        .innerJoin(Item, eq(CartItem.item, Item.id))
        .groupBy(Cart.id)
})

// export const CartData = pgView('cart_data').as(qb => {
//     return qb.select({
//         id: Cart.id,
//         uid: Cart.uid,
// items: coalesce(
//     filter(
//         json_agg_object({
//             id: ScriptData.id,
//             uuid: ScriptData.uuid,
//             type: ScriptData.type,
//             name: ScriptData.name,
//             slug: ScriptData.slug,
//             status: ScriptData.status,
//             image: ScriptData.image,
//             description: ScriptData.description,
//             created_at: ScriptData.created_at,
//             updated_at: ScriptData.updated_at,
//             archived_at: ScriptData.archived_at,
//         }),
//         eq(CartItem.item_type, 'script')
//     ), sql`'[]'::json`
// ).as('items'),
//         // coupons: filter(
//         //     array_agg(ItemCoupon),
//         //     eq(CartItem.item_type, 'coupon')
//         // ).as('coupons'),
//         created_at: Cart.created_at,
//         updated_at: max(CartItem.updated_at).as('updated_at')
//     })
//         .from(Cart)
//         .innerJoin(CartItem, eq(CartItem.cart_id, Cart.id))
//         .leftJoin(ItemScript, eq(CartItem.item_id, ItemScript.id))
//         // .leftJoin(CouponData, eq(CartItem.item_id, CouponData.id))
//         .groupBy(Cart.id)
// })

export type Cart = InferSelectModel<typeof Cart>
export type CartItem = InferSelectModel<typeof CartItem>
export type CartData = InferSelectViewModel<typeof CartData>
