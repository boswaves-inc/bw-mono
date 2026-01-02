import { data, Outlet } from "react-router";
import type { Route } from "./+types/cart";
import { Cart, CartItem, ItemPrice } from "@boswaves/core";
import { and, eq, getTableColumns, isNotNull, notExists, sql, } from "drizzle-orm";
import { coalesce, json_agg_object } from "@boswaves/core/utils/drizzle";
import { CartCoupon } from "@boswaves/core/schema/shop/cart";

import { Container } from "~/components/v3/container";
import { GradientBackground } from "~/components/v3/gradient";
import { Navigation } from "~/components/v3/navbar";
import { getSession } from "~/utils/session";
import {  cookieSession } from "~/cookie";
import { formData } from "zod-form-data";
import { createInsertSchema } from "drizzle-zod";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function loader({ context }: Route.LoaderArgs) {
    const cart = await context.postgres.select({
        ...getTableColumns(Cart),
        cart_item: coalesce(
            json_agg_object({
                ...getTableColumns(CartItem)
            }, isNotNull(CartItem.id)),
            sql`'[]'::json`
        ).as('cart_item'),
        cart_coupon: coalesce(
            json_agg_object({
                ...getTableColumns(CartCoupon)
            }, isNotNull(CartCoupon.id)),
            sql`'[]'::json`
        ).as('cart_item'),
    })
        .from(Cart)
        .leftJoin(CartItem, and(
            eq(CartItem.id, Cart.id)
        ))
        .leftJoin(CartCoupon, and(
            eq(CartCoupon.id, CartCoupon.id),
        ))
        .where(eq(Cart.id, context.cart.id))
        .groupBy(Cart.id)
        .limit(1)
        .then(x => x.at(0))

    return data({ cart })
}

export async function action({ request, context }: Route.ActionArgs) {
    const session = await getSession(request, cookieSession)
    const schema = formData(createInsertSchema(CartItem).pick({
        item_price: true
    }))

    switch (request.method) {
        case 'PUT': {
            const form = await request.formData()
            const result = await schema.parseAsync(form)

            await context.postgres.transaction(async tx => {
                const [cart, item] = await Promise.all([
                    new Promise<string>(async resolve => {
                        const current = session.get('cart');

                        if (current != undefined) {
                            if (await tx.$count(Cart, eq(Cart.id, current)) > 0) {
                                return resolve(current)
                            }

                            session.unset('cart')
                        }

                        // Create a new cart here
                        const cart = await tx.insert(Cart).values({
                            uid: undefined
                        }).returning().then(x => x[0])

                        // Set the cart to the session cookie for tracking
                        session.set('cart', cart.id)

                        return resolve(cart.id)
                    }),
                    tx.select({ id: ItemPrice.id }).from(ItemPrice)
                        .where(eq(ItemPrice.id, result.item_price))
                        .then(x => x.at(0))
                ])

                if (item == undefined) {
                    throw new Error('item does not exist');
                }

                // Insert the item and update the cart
                await Promise.all([
                    tx.update(Cart).set({
                        updated_at: new Date()
                    }).where(eq(Cart.id, cart)),
                    tx.insert(CartItem).values({
                        id: cart,
                        quantity: 1,
                        item_price: result.item_price,
                    })
                ])
            })

            return data({ success: true }, {
                headers: [
                    ["Set-Cookie", await cookieSession.commitSession(session)]
                ]
            })
        };
        case 'DELETE': {
            const cart_id = session.get('cart')

            if (cart_id == undefined) {
                return data(null, 400)
            }

            const form = await request.formData()
            const req = await schema.parseAsync(form)

            await context.postgres.transaction(async tx => {
                await tx.delete(CartItem).where(
                    and(
                        eq(CartItem.item_price, req.item_price),
                        eq(CartItem.id, cart_id)
                    )
                )

                await tx.update(Cart).set({
                    updated_at: new Date()
                }).returning()

                await tx.delete(Cart).where(
                    notExists(tx.select().from(CartItem).where(
                        eq(CartItem.id, Cart.id))
                    )
                );
            })

            return data({ success: true })
        };
    }
}

export default function renderer({ loaderData: { cart } }: Route.ComponentProps) {
    return (
        <main className="overflow-hidden">
            <GradientBackground />
            <Container>
                <Navigation />
            </Container>

            <Outlet />
        </main >
    );
}