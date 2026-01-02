import Page from "~/components/page";
import { data, Form, Link, Outlet, useFetcher } from "react-router";
import type { Route } from "./+types/cart._index";
import { formData } from "zod-form-data";
import { getSession } from "~/utils/session";
import { Cart, CartItem, Item, ItemPrice } from "@boswaves-inc/webstore-core";
import { and, eq, getTableColumns, isNotNull, notExists, sql, } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import Section from "~/components/section";
import { Footer } from "~/components/v3/footer";
import { Container } from "~/components/v3/container";
import { GradientBackground } from "~/components/v3/gradient";
import { Navigation } from "~/components/v3/navbar";
import { Heading, Lead, Paragraph, Subheading } from "~/components/v3/core/typography";
import { LucideShoppingBag, Plus, Star, XIcon } from "lucide-react";
import { Button } from "~/components/v3/core/button";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function loader({ context }: Route.LoaderArgs) {
    context.cart
    // const cart = await context.postgres.select({
    //     ...getTableColumns(Cart),
    //     cart_item: coalesce(
    //         json_agg_object({
    //             ...getTableColumns(CartItem)
    //         }, isNotNull(CartItem.id)),
    //         sql`'[]'::json`
    //     ).as('cart_item'),
    //     cart_coupon: coalesce(
    //         json_agg_object({
    //             ...getTableColumns(CartCoupon)
    //         }, isNotNull(CartCoupon.id)),
    //         sql`'[]'::json`
    //     ).as('cart_item'),
    // })
    //     .from(Cart)
    //     .leftJoin(CartItem, and(
    //         eq(CartItem.id, Cart.id)
    //     ))
    //     .leftJoin(CartCoupon, and(
    //         eq(CartCoupon.id, CartCoupon.id),
    //     ))
    //     .where(eq(Cart.id, context.cart.id))
    //     .groupBy(Cart.id)
    //     .limit(1)
    //     .then(x => x.at(0))

    // return data({ cart })
}


export default function renderer({ matches }: Route.ComponentProps) {
    const { cart } = matches[0].loaderData

    return (
        <main className="overflow-hidden">
            {/* Title */}
            <Container className="mt-16">
                <Subheading>
                    almost there
                </Subheading>
                <Heading size="h1" className="mt-2">
                    Your Shopping Cart
                </Heading>
            </Container>

            {/* Content */}
            <div className="mt-16 pb-24">
                <Container>
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">

                        {/* Items */}
                        <ul role="list" className="list-none border-y h-fit lg:col-span-2">
                            <li className=" sm:py-10 py-6 not-last:border-b flex">
                                <div className="shrink-0">
                                    <img src="	https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75" className="sm:h-48 h-28 max-w-full rounded-2xl object-cover aspect-3/2 " />
                                </div>
                                <div className=" flex-col flex flex-1 ml-4 lg:ml-6 justify-between">
                                    <div className="flex h-full flex-col pr-9 sm:pr-0 relative">
                                        <div className="text-base/7 font-medium">
                                            Quick Valuation Osscilator
                                        </div>
                                        <div className=" flex mt-1 items-center">
                                            <Star className="size-4 fill-yellow-400 stroke-none" />
                                            <Star className="size-4 fill-yellow-400 stroke-none" />
                                            <Star className="size-4 fill-yellow-400 stroke-none" />
                                            <Star className="size-4 fill-yellow-400 stroke-none" />
                                            <Star className="size-4 fill-gray-300 stroke-none" />
                                        </div>
                                        <div className=" mt-auto sm:mt-1 flex items-center gap-4">
                                            <div className="text-3xl font-medium text-gray-950">
                                                $99
                                            </div>
                                            <div className="text-xs/4 text-nowrap text-gray-950/75">
                                                <p>USD</p>
                                                <p>per month</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:flex hidden flex-wrap gap-2">
                                        <span className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-xs/6 font-medium text-gray-500">
                                            Indicator
                                        </span>
                                        <span className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-xs/6 font-medium text-gray-500">
                                            Trend Following
                                        </span>
                                        <span className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-xs/6 font-medium text-gray-500">
                                            Volume
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className="text-gray-500">
                                        <XIcon className="size-4" />
                                    </button>
                                </div>
                            </li>
                        </ul>

                        {/* Card */}
                        <div className="-m-2 grid grid-cols-1 sticky rounded-4xl shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 h-fit ring-black/5 ">
                            <div className="grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5">
                                <div className="rounded-3xl bg-white p-10 pb-9 shadow-2xl ring-1 ring-black/5">
                                    <Subheading>
                                        order summary
                                    </Subheading>
                                    <p className="mt-2 text-sm/6 text-gray-950/75">
                                        Monthly subscription
                                    </p>

                                    <ul className="mt-8">
                                        <li className="py-4 border-b border-gray-200 text-gray-700 text-base/7 font-normal flex justify-between">
                                            <span>
                                                Subtotal
                                            </span>
                                            <span className="text-lg/7 tracking-tight font-medium text-gray-950">
                                                $99.99
                                            </span>
                                        </li>
                                        <li className="py-4 border-b border-gray-200 text-base/7 text-gray-700 font-normal flex justify-between">
                                            <span>
                                                Discount
                                            </span>
                                            <span className="text-lg/7 tracking-tight font-medium text-gray-950">
                                                $0.00
                                            </span>
                                        </li>
                                        <li className="text-base/7 py-4 flex justify-between font-semibold tracking-tight">
                                            <span>
                                                Order Total
                                            </span>
                                            <span className="text-lg/7 tracking-tight font-medium text-gray-950">
                                                $99.99 p/m
                                            </span>
                                        </li>

                                    </ul>

                                    {/* <div className="mt-8 flex items-center gap-4">
                                        <div className="text-5xl font-medium text-gray-950">W
                                            $99
                                        </div>
                                        <div className="text-sm/5 text-gray-950/75">
                                            <p>USD</p>
                                            <p>per month</p>
                                        </div>
                                    </div> */}

                                    {/* <div className="mt-8">
                                        <h3 className="text-sm/6 font-medium text-gray-950">
                                            Start selling with:
                                        </h3>
                                        <ul className="mt-3 space-y-3">
                                            <li className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25">
                                                <span className="inline-flex h-6 items-center">
                                                    <Plus className="size-3.75 shrink-0 fill-gray-950/25" />
                                                </span>
                                                <span className="sr-only">Not included:</span>
                                                Up to 3 team members
                                            </li>
                                            <li className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25">
                                                <span className="inline-flex h-6 items-center">
                                                    <Plus className="size-3.75 shrink-0 fill-gray-950/25" />
                                                </span>
                                                <span className="sr-only">Not included:</span>
                                                Up to 5 deal progress boards
                                            </li>
                                            <li className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25">
                                                <span className="inline-flex h-6 items-center">
                                                    <Plus className="size-3.75 shrink-0 fill-gray-950/25" />
                                                </span>
                                                <span className="sr-only">Not included:</span>
                                                Source leads from select platforms
                                            </li>
                                            <li className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25">
                                                <span className="inline-flex h-6 items-center">
                                                    <Plus className="size-3.75 shrink-0 fill-gray-950/25" />
                                                </span>
                                                <span className="sr-only">Not included:</span>
                                                RadiantAI integrations
                                            </li>
                                            <li className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25">
                                                <span className="inline-flex h-6 items-center">
                                                    <Plus className="size-3.75 shrink-0 fill-gray-950/25" />
                                                </span>
                                                <span className="sr-only">Not included:</span>
                                                5 competitor analyses per month
                                            </li>
                                        </ul>
                                    </div> */}
                                    <div className="mt-8">
                                        <Button variant="secondary" className="w-full" >
                                            Redeem discount
                                        </Button>
                                        <Button className="w-full mt-4" >
                                            Checkout
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* <Footer /> */}
        </main >
    );
}