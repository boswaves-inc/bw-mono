import Section from "~/components/section";
import { data, Link, useFetcher } from "react-router";
import type { Route } from "./+types/cart";
import { formData } from "zod-form-data";
import { cartSession } from "~/cookie";
import { getSession } from "~/utils/session";
import { Cart, CartItem, Item, ItemPrice } from "@bw/core";
import { and, eq, getTableColumns, notExists, sql, } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { ButtonV2 } from "~/components/core/v2/button";

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
        item_price: true
    }))

    switch (request.method) {
        case 'PUT': {
            const form = await request.formData()
            const result = await schema.parseAsync(form)

            await context.postgres.transaction(async tx => {
                const [cart, item] = await Promise.all([
                    new Promise<string>(async resolve => {
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

export default function renderer() {
    const cart = useFetcher({ key: 'cart' })

    return (
        <div>
            <Section>
                <Link to={'/checkout'}>
                    <ButtonV2>Checkout</ButtonV2>
                </Link>
            </Section>
        </div>
    );
}