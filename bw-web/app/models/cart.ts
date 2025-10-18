import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const Cart = pgTable("cart_info", (t) => ({
    id: t.uuid().primaryKey().defaultRandom().notNull(),
    emaild: t.varchar({ length: 255 }).notNull().unique(),
}));

// export const CartRelation = relations(Cart, ({ one }) => ({
//     cart: one(CartItem),
// }));

export const CartItem = pgTable("cart_items", (t) => ({
    cart: t.uuid().references(() => Cart.id)
}));

// export const CartItemRelation = relations(CartItem, ({ one }) => ({
//     cart: one(Cart, { fields: [CartItem.cart], references: [Cart.id] }),
// }));

// type Analytic = PgInfer<typeof Analytic>;