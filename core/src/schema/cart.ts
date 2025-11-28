import { User } from "./user";
import { Item, ItemPrice, ItemScript, ItemType } from "./item";
import { foreignKey, getTableConfig, index, pgTable, pgView, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { eq, getTableColumns, isNotNull, max, or, sql, type InferSelectModel, type InferSelectViewModel } from "drizzle-orm";
import { array_agg, json_agg_object } from "../utils/drizzle";

export const Cart = pgTable("cart_info", t => ({
    id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    uid: t.uuid().references(() => User.uid, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}), t => [
    index('cart_uid_idx').on(t.uid)
]);

export const CartItem = pgTable("cart_item", t => ({
    id: t.uuid().primaryKey().references(() => Cart.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    quantity: t.integer().notNull(),
    item_price: t.uuid().references(() => ItemPrice.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}), t => [
    index('cart_item_id_idx').on(t.id),
    index('cart_item_item_price_idx').on(t.item_price),
    uniqueIndex('cart_item_id_item_price_idx').on(t.id, t.item_price),
]);

// export const CartCoupon = pgTable("cart_coupon", (t) => ({
//     id: t.uuid().primaryKey().references(() => Cart.id, {
//         onDelete: 'cascade',
//         onUpdate: 'cascade'
//     }).notNull(),
//     item_price: t.uuid().references(() => ItemPrice.id, {
//         onDelete: 'cascade',
//         onUpdate: 'cascade'
//     }).notNull(),
//     created_at: t.timestamp().defaultNow().notNull(),
//     updated_at: t.timestamp().defaultNow().notNull(),
// }));

// export const CartData = pgView('cart_data').as(qb => {
//     return qb.select({
//         id: Cart.id,
//         uid: Cart.uid,
//         items: json_agg_object(
//             { 
//                 id: CartItem.id,
//                 quantity: CartItem.quantity,
//                 item_price: CartItem.item_price,
//             },
//             isNotNull(CartItem.id)
//         ).as('items')
//     }).from(Cart)
//         .innerJoin(CartItem, eq(Cart.id, CartItem.id))
//         .groupBy(Cart.id)
// })

export type Cart = InferSelectModel<typeof Cart>
export type CartItem = InferSelectModel<typeof CartItem>
// export type CartData = InferSelectViewModel<typeof CartData>
