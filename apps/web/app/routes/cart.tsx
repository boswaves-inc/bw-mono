import Section from "~/components/section";
import { data, Link, useFetcher } from "react-router";
import Button from "~/components/core/button";
import type { Route } from "./+types/cart";
import { formData } from "zod-form-data";
import { object, z } from "zod/v4";
import { cartSession } from "~/cookie";
import { getSession } from "~/utils/session";
import { Cart, CartItem } from "@bw/core";
import { and, eq } from "drizzle-orm";

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
    const schema = formData(object({
        id: z.uuidv4(),
        type: z.enum(['coupon', 'script'])
    }))

    switch (request.method) {
        case 'PUT': {
            const form = await request.formData()
            const result = await schema.parseAsync(form)

            // Open a new postgres transaction
            await context.postgres.transaction(async tx => {
                const cart_id = await new Promise<string>(async resolve => {
                    const current = session.get('id');

                    if (current != undefined) {
                        return resolve(current)
                    }

                    // Create a new cart here
                    const cart = await tx.insert(Cart).values({
                        uid: undefined
                    }).returning().then(x => x[0])

                    // Set the cart to the session cookie for tracking
                    session.set('id', cart.id)

                    return resolve(cart.id)
                })

                // Insert the item and update the cart
                await Promise.all([
                    tx.update(Cart).set({
                        updated_at: new Date()
                    }),
                    tx.insert(CartItem).values({
                        cart_id,
                        item_id: result.id,
                        item_type: result.type
                    })
                ])

                // await tx.refreshMaterializedView(CartData)
            })

            return data({ items: [], coupons: [] }, {
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
                    eq(CartItem.item_id, result.id),
                    eq(CartItem.cart_id, cart_id)
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