import { User } from "../auth/user";
import { ItemPrice } from "./item";
import { index, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { type InferSelectModel, } from "drizzle-orm";

export const Cart = pgTable("carts", t => ({
    id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    uid: t.uuid().references(() => User.uid, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}), t => [
    index('cart_uid_idx').on(t.uid)
]);

export const CartItem = pgTable("cart_items", t => ({
    id: t.uuid().primaryKey().references(() => Cart.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    quantity: t.integer().notNull(),
    item_price: t.uuid().references(() => ItemPrice.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}), t => [
    index('cart_item_id_idx').on(t.id),
    index('cart_item_item_price_idx').on(t.item_price),
    uniqueIndex('cart_item_id_item_price_idx').on(t.id, t.item_price),
]);

export const CartCoupon = pgTable("cart_coupons", t => ({
    id: t.uuid().primaryKey().references(() => Cart.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    coupon: t.uuid().references(() => ItemPrice.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).notNull(),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}), t => [
    index('cart_coupon_id_idx').on(t.id),
    index('cart_coupon_item_price_idx').on(t.coupon),
    uniqueIndex('cart_coupon_id_item_price_idx').on(t.id, t.coupon),
]);

export type Cart = InferSelectModel<typeof Cart>
export type CartItem = InferSelectModel<typeof CartItem>
