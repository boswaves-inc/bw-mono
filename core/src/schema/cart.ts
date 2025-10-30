import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import { User } from "./user";

export const Cart = pgTable("cart_info", (t) => ({
    uid: t.uuid().primaryKey().references(() => User.uid),
    promo_code: t.varchar({ length: 255 })
}));

export const CartItem = pgTable("cart_items", (t) => ({
    id: t.varchar({ length: 255 }).notNull(),
    uid: t.uuid().references(() => Cart.uid).notNull(),
    quantity: t.integer().default(1).notNull()
}), ({ id, uid }) => [
    primaryKey({ columns: [id, uid] })
]);

export type Cart = typeof Cart.$inferSelect;
export type CartItem = typeof CartItem.$inferSelect;