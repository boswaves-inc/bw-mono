import Section from "~/components/section";
import { data, Link, useFetcher } from "react-router";
import Button from "~/components/core/button";
import type { Route } from "./+types/cart";
import { formData } from "zod-form-data";
import { object, z } from "zod/v4";
import { cartSession } from "~/cookie";
import { getSession } from "~/utils/session";
import { Cart, CartData, CartItem, Item } from "@bw/core";
import { and, eq, } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function loader({ }: Route.LoaderArgs) {

    return data({})
}

export async function action({ request, context }: Route.ActionArgs) {
    const session = await getSession(request, cartSession)
    const schema = formData(createInsertSchema(CartItem).pick({
        id: true,
    }))

    switch (request.method) {
        case 'PUT': {
            const form = await request.formData()
            const result = await schema.parseAsync(form)

            const cart = await context.postgres.transaction(async tx => {
                const cart_id = await new Promise<string>(async resolve => {
                    const current = session.get('id');

                    if (current != undefined) {
                        if (await tx.$count(Cart, eq(Cart.id, current)) > 0) {
                            return resolve(current)
                        }

                        session.unset('id')
                    }

                    // Create a new cart here
                    const cart = await tx.insert(Cart).values({
                        uid: undefined
                    }).returning().then(x => x[0])

                    // Set the cart to the session cookie for tracking
                    session.set('id', cart.id)

                    return resolve(cart.id)
                })

                const item = await tx.select().from(Item).where(
                    eq(Item.id, result.id)
                ).then(x => x.at(0))

                if (item == undefined) {
                    throw new Error('item does not exist');
                }

                // Insert the item and update the cart
                await Promise.all([
                    tx.update(Cart).set({
                        updated_at: new Date()
                    }).where(eq(Cart.id, cart_id)),
                    tx.insert(CartItem).values({
                        id: cart_id,
                        item: result.id,
                        type: item.type
                    })
                ])

                const cart = await tx.select().from(CartData).where(
                    eq(CartData.id, cart_id)
                ).limit(1).then(x => x[0])

                return cart
            })

            return data(cart, {
                headers: [
                    ["Set-Cookie", await cartSession.commitSession(session)]
                ]
            })
        };
        case 'DELETE': {
            const cart_id = session.get('id')

            if (cart_id == undefined) {
                return data(null, 400)
            }

            const form = await request.formData()
            const result = await schema.parseAsync(form)

            await context.postgres.transaction(async tx => {
                await tx.delete(CartItem).where(and(
                    eq(CartItem.item, result.id),
                    eq(CartItem.id, cart_id)
                ))

                await tx.update(Cart).set({
                    updated_at: new Date()
                })
            })

            return data({ items: [], coupons: [] })
        };
    }
}

export default function renderer() {
    const cart = useFetcher({ key: 'cart' })

    return (
        <div>
            <Section>
                <Link to={'/checkout'}>
                    <Button>Checkout</Button>
                </Link>
            </Section>
        </div>
    );
}