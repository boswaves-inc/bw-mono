import type { Route } from "./+types/_store.library.$id";
import Section from "~/components/core/section";
import { data, useFetcher } from "react-router";
import Button from "~/components/core/button";
import { type FormEvent } from "react";
import { Card, CardCvv, CardExpiry, useCard, CardNumber } from "~/libs/chargebee/react";
import { chargebee } from "~/services";

export async function loader() {
    return data({})
}


export async function action({ request }: Route.ActionArgs) {
    const form = await request.formData()
    const intent = form.get('intent')?.toString()!;
    const token = form.get('token')?.toString()!;

    const source = await chargebee.paymentSource.createUsingToken({
        replace_primary_payment_source: true,
        customer_id: 'cbdemo_peter',
        token_id: token,

    })

    const subscription = await chargebee.subscription.createWithItems('cbdemo_peter', {
        subscription_items: [{
            item_price_id: 'cbdemo_business-suite-monthly',
            quantity: 1,
        }],
        payment_intent: {
            id: intent,
            gateway_account_id: 'gw_BTLvdtV06HFfy2GI'
        }
    })

    if (subscription.invoice?.status == 'not_paid' || subscription.invoice?.status == 'payment_due') {
        try {
            const collect = await chargebee.invoice.collectPayment(subscription.invoice.id, {
                amount: subscription.invoice.amount_due,
                payment_source_id: source.payment_source.id,
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


    return data({})
}


export default function renderer() {
    const card = useCard()
    const fetcher = useFetcher()

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)
        const { intent } = await fetch('/api/checkout', { method: 'post' }).then(x => x.json())

        const component = card.component()!;
        const auth = await component.authorizeWith3ds(
            intent,
            {
                billingAddress: {
                    firstName: 'Peter',
                    lastName: 'Wright'
                }
            },
            {
                change: (paymentIntent: any) => {
                    console.log('📝 3DS state changed:', paymentIntent.status)
                },
                success: (paymentIntent: any) => {
                    console.log('✅ 3DS authorized successfully')
                },
                error: (paymentIntent: any, error: any) => {
                    console.error('❌ 3DS error:', error)
                }
            }
        )

        const token = await component.tokenize()

        if (!token) {
            console.log(token)
            return
        }

        data.append('token', token.token)
        data.append('intent', auth.id)

        await fetcher.submit(data, { method: 'post' })
    }

    return (
        <div>
            <Section>
                <fetcher.Form action="./" method="post" onSubmit={onSubmit}>
                    <Card ref={card.ref}>
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold text-gray-700">
                                Card Number
                            </label>
                            <div className="px-4 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                <CardNumber />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">
                                    Expiry Date
                                </label>
                                <div className="px-4 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                    <CardExpiry />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">
                                    CVC
                                </label>
                                <div className="px-4 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                    <CardCvv />
                                </div>
                            </div>

                        </div>
                    </Card>
                    <Button >test</Button>
                </fetcher.Form>
            </Section>
        </div>
    );
}