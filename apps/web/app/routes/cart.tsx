import Page from "~/components/page";
import { data, Form, Link, Outlet, useFetcher } from "react-router";
import type { Route } from "./+types/cart";
import { formData } from "zod-form-data";
import { cartSession } from "~/cookie";
import { getSession } from "~/utils/session";
import { Cart, CartItem, Item, ItemPrice } from "@bw/core";
import { and, eq, getTableColumns, isNotNull, notExists, sql, } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { Button } from "~/components/core/v2/button";
import { coalesce, json_agg_object } from "@bw/core/utils/drizzle.ts";
import { CartCoupon } from "@bw/core/schema/cart.ts";
import { Heading, Paragraph } from "~/components/core/v2/typography";

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

export default function renderer({ loaderData: { cart } }: Route.ComponentProps) {


    return (
        <Page>
            <Heading className=" text-left" >
                Shopping Cart
            </Heading>
            <Form className="xl:gap-x-16 lg:gap-x-12 lg:items-start lg:grid-cols-12 lg:grid mt-12">
                <section aria-labelledby="cart-heading" className=" lg:col-span-7">
                    <h2 className="sr-only">Items in your shopping cart</h2>
                    <ul role="list" className="list-none border-y">
                        <li className=" sm:py-10 py-6 not-last:border-b flex">
                            <div className="shrink-0">
                                <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-01-product-01.jpg" className="sm:size-48 size-24 max-w-full object-cover rounded-sm" />
                            </div>
                            <div className=" flex-col flex flex-1 ml-4 sm:ml-6 justify-between">
                                <div className="sm:gap-x-6 sm:grid-cols-2 grid pr-9 sm:pr-0 relative">
                                    <div >
                                        <Paragraph variant="label">Quick Valuation Osscilator</Paragraph>
                                        <Paragraph className="flex mt-1" variant="muted">
                                            <span>
                                                Indicator
                                            </span>
                                            <span className=" ml-4 border-l pl-4">
                                                Volume
                                            </span>
                                        </Paragraph>
                                        <Paragraph className="mt-1" variant="label">$30.00</Paragraph>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </section>
            </Form>
        </Page>
    );
}