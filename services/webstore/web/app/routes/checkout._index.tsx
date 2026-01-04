import type { Route } from "./+types/checkout._index";
import { data, Link, useFetcher, useLoaderData } from "react-router";
import { useState, type FormEvent } from "react";
import { CardGroup, CardCvc, CardExpiry, CardNumber, useCard } from "~/components/chargebee";
import Paragraph from "~/components/core/paragraph";
import Label from "~/components/core/label";
import { Check, ChevronLeft, LockIcon, RotateCw } from "lucide-react";
import { Radio, RadioGroup } from "~/components/core/radio";
import { Field, } from "@headlessui/react";
import { formatCurrency } from "@coingecko/cryptoformat";
import { AppleLogo, GoogleLogo, StripeLogo } from "~/components/icons/logo";
import { Cart, CartItem } from "@boswaves-inc/webstore-core";
import { and, eq, getTableColumns, isNotNull, sql } from "drizzle-orm";
import { Button } from "~/components/core/v2/button";
import { coalesce, json_agg_object } from "@boswaves-inc/webstore-core/utils/drizzle";
import { CartCoupon } from "@boswaves-inc/webstore-core/schema/shop/cart";
import _ from "lodash";
import { Heading } from "~/components/core/v2/typography";

export async function loader({ context }: Route.LoaderArgs) {
    const result = await context.postgres.select({
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

    if (result == undefined) {
        throw new Error('failed to load cart')
    }

    const plans = [
        {
            id: 'monthly',
            title: 'Montly',
            interval: 'month',
            total: 1586,
        },
        {
            id: 'yearly',
            interval: 'year',
            title: 'Yearly',
            total: 1586,
            discount: 20
        }
    ]

    result.cart_item.map(({ quantity, item_price }) => ({
        item_price_id: item_price,
        quantity
    }))

    const { estimate } = await context.chargebee.estimate.createSubItemEstimate({
        tax_providers_fields: [],
        subscription_items: result.cart_item.map(({ quantity, item_price }) => ({
            item_price_id: item_price,
            quantity
        })),
        coupon_ids: [
            '60f4cc6c-8f26-4657-b25e-3b24071f6769'
        ]
    })

    if (estimate.invoice_estimate == undefined) {
        throw new Error('failed to estimate invoce')
    }

    const total_discount = _.sum(estimate.invoice_estimate.discounts?.map(x => x.amount))

    return data({
        currency: 'USD',
        estimate: estimate.invoice_estimate,
        total_discount,
        plans,
    })
}

export async function action({ request, context }: Route.ActionArgs) {
    const form = await request.formData()
    const intent = form.get('intent')?.toString()!;

    const subscription = await context.chargebee.subscription.createWithItems('cbdemo_peter', {
        subscription_items: [
            {
                item_price_id: 'cbdemo_business-suite-monthly',
                quantity: 1,
            }
        ],
        auto_collection: 'on',
        payment_intent: {
            id: intent,
            // gw_token: token,
            // gateway_account_id: 'gw_BTLvdtV06HFfy2GI'
        },
    })

    if (subscription.invoice?.status == 'not_paid' || subscription.invoice?.status == 'payment_due') {
        try {
            const collect = await context.chargebee.invoice.collectPayment(subscription.invoice.id, {
                amount: subscription.invoice.amount_due,
                // payment_source_id: source.payment_source.id,
            })

            console.log(collect)
        }
        catch (error: any) {
            if (error.api_error_code == 'payment_processing_failed' && error.payment_intent?.redirect_url) {
                console.log(error)
            }

            console.error(error)
        }
    }
    else {
        console.log('payment succesfull')
    }

    return data({})
}

export default function renderer({ loaderData: { plans, currency, estimate, total_discount } }: Route.ComponentProps) {
    const card = useCard()
    const fetcher = useFetcher()

    const [plan, setPlan] = useState<string>(plans[0].id)

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)
        const { intent } = await fetch('/checkout/intent', { method: 'post' }).then(x => x.json())

        const component = card.component()!;

        const auth = await component.authorizeWith3ds(intent,
            {
                billingAddress: {
                    firstName: 'Peter',
                    lastName: 'Wright'
                }
            },
            {
                change: ({ status, id }: { status: string, id: string }) => {
                    console.log('📝 3DS state changed:', status)
                },
                success: ({ status, id }: { status: string, id: string }) => {
                    console.log('✅ 3DS authorized successfully')

                },
                error: (paymentIntent: any, error: any) => {
                    console.error('❌ 3DS error:', error)
                }
            }
        )

        data.append('intent', auth.id)

        await fetcher.submit(data, { method: 'POST' })
    }

    return (
        <div className="lg:min-h-lvh">
            <div aria-hidden="true" className="absolute  inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"></div>
            </div>
            <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"></div>
            </div>
            <div className=" fixed inset-0 left-1/2 from-transparent to-indigo-400/25 bg-linear-to-r" />
            <div className="px-4 sm:px-6 relative lg:px-8  max-w-7xl mx-auto sm:pb-20">
                <div className="">
                    <Link relative="path" to='..' className="block w-fit">
                        <Heading size="h4" className="flex gap-x-2 items-center w-fit">
                            <ChevronLeft className="size-4" />
                            Back to cart
                        </Heading>
                    </Link>
                </div>
                <fetcher.Form action="./" method="post" onSubmit={onSubmit} className="lg:grid-cols-2 mt-6 gap-x-16 max-w-7xl grid mx-auto">
                    <div className="lg:max-w-none grow w-full max-w-lg mx-auto">
                        <Heading size="h1" className="font-bold ">Complete your order</Heading>
                        <Paragraph className="mt-2">Everything you need to get started</Paragraph>
                        <div className="mt-10">
                            <Heading size="h5" className="text-lg flex gap-2 items-center">
                                <LockIcon strokeWidth={3} className="size-4 text-gray-400" />
                                Secure Payment
                            </Heading>
                            <Paragraph className="max-w-sm">
                                No questions asked, and refunds if you're unhappy with the service
                            </Paragraph>
                        </div>
                        <div className="mt-6">
                            <Heading size="h5" className="text-lg flex gap-2 items-center">
                                <RotateCw strokeWidth={3} className="size-4 text-gray-400" />
                                Cancel anytime
                            </Heading>
                            <Paragraph className="max-w-sm">
                                No questions asked, and refunds if you're unhappy with the service
                            </Paragraph>
                        </div>
                        <div className="pt-10 mt-10 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between">
                                <Heading size="h5" className="text-base/7 font-semibold">
                                    Subtotal
                                </Heading>
                                <Heading size="h5" className="text-base/7 font-semibold">
                                    {formatCurrency(estimate.sub_total / 100, currency, 'en', false, false)}
                                </Heading>
                            </div>
                            <div className="flex justify-between mt-2">
                                <Heading size="h5" className="text-base/7 font-semibold">
                                    Discount
                                </Heading>
                                <Heading size="h5" className="text-base/7 font-semibold">
                                    {formatCurrency(total_discount / 100, currency, 'en', false, false)}
                                </Heading>
                            </div>
                            <div className="flex justify-between mt-2">
                                <Heading size="h5" className="text-base/7 font-semibold">
                                    Tax
                                </Heading>
                                <Heading size="h5" className="text-base/7 font-semibold">
                                    {formatCurrency(0, currency, 'en', false, false)}
                                </Heading>
                            </div>
                            <div className="flex gap-6 mt-6">
                                <Button variant="outline">
                                    Add promotion code
                                </Button>
                            </div>
                        </div>
                        <div className="pt-10 mt-10 border-t">
                            <div className="flex justify-between">
                                <Heading size="h5" className="text-lg/7 font-semibold">
                                    Total due
                                </Heading>
                                <Heading size="h5" className="text-lg/7 font-semibold">
                                    {formatCurrency(estimate.amount_due! / 100, currency, 'en', false, false)}
                                </Heading>
                            </div>
                        </div>
                    </div>

                    <div className="lg:max-w-none w-full max-w-lg mx-auto" >
                        <Heading size="h5" className="text-lg/7">
                            Payment information
                        </Heading>
                        <RadioGroup value={plan} onChange={setPlan} className="mt-2 outline bg-gray-900 dark:outline-white/10 rounded-md outline-gray-900/10">
                            {plans.map(({ id, interval, discount, title, total }) => (
                                <Field key={id} className='group/field not-last:border-b'>
                                    <Radio value={id} className="p-4 outline-primary touch-none data-checked:outline-2 group/radio group-first/field:rounded-t-md flex justify-between items-start group-last/field:rounded-b-md data-checked:bg-gray-800">
                                        <div>
                                            <Label>{title}</Label>
                                            <Paragraph size="sm">{formatCurrency(total, currency, 'en', false, true)}/{interval}</Paragraph>
                                        </div>
                                        <div className="flex items-start gap-x-3">
                                            {discount && (
                                                <span className="text-xs/4 p-0.5 px-2 block rounded-full bg-primary">
                                                    {discount}% OFF
                                                </span>
                                            )}
                                            <span className="rounded-full flex size-5 group-data-checked/radio:bg-primary ring-1">
                                                <Check strokeWidth={4} className="size-3 m-auto transiop group-data-checked/radio:opacity-100 opacity-0" />
                                            </span>
                                        </div>
                                    </Radio>
                                </Field>
                            ))}
                        </RadioGroup>
                        <Heading size="h5" className="text-lg/7 mt-10">
                            Payment method
                        </Heading>
                        <CardGroup ref={card.ref} >
                            <div className="sm:grid-cols-3 mt-2 gap-y-6 gap-x-4 grid-cols-1 grid">
                                <div className="col-span-3">
                                    <Label>Card number</Label>
                                    <div className="mt-2">
                                        <CardNumber />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <Label>Expiry</Label>
                                    <div className="mt-2">
                                        <CardExpiry />
                                    </div>
                                </div>
                                <div>
                                    <Label>CVC</Label>
                                    <div className="mt-2">
                                        <CardCvc />
                                    </div>
                                </div>

                            </div>
                        </CardGroup>
                        <Button size="lg" className="mt-10 w-full">
                            Continue
                        </Button>
                        <div className="relative mt-6">
                            <div className=" flex relative justify-center items-center">
                                <div className=" border-gray-200 dark:border-gray-700 w-full border-t" />
                                <Paragraph className="px-4 text-base">
                                    or
                                </Paragraph>
                                <div className="w-full border-t" />
                            </div>
                        </div>
                        <div className="gap-x-6 flex mt-6">
                            <Button size="lg" className=" grow">
                                <span className="sr-only">Pay with Google Pay</span>
                                <GoogleLogo className="size-5!" />
                            </Button>
                            <Button size="lg" className="grow">
                                <span className="sr-only">Pay with Apple Pay</span>
                                <AppleLogo className="w-auto! h-5!" />
                            </Button>
                        </div>
                        <div className="mt-10">
                            <Heading size="h5" className="text-lg/7 justify-center items-center flex dark:fill-primary dark:text-primary gap-2">
                                <span>
                                    Powered by
                                </span>
                                <StripeLogo className="h-5" />
                            </Heading>
                        </div>
                    </div>
                </fetcher.Form>
            </div>
        </div>
    );
}