import type { Route } from "./+types/_store.library.$id";
import { data, Outlet, } from "react-router";
import { ChargebeeProvider } from "~/libs/chargebee/react";

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

    switch (request.method) {
        case 'POST': {
            const form = await request.formData()
            const intent = form.get('intent')?.toString()!;

            const subscription = await context.chargebee.subscription.createWithItems('cbdemo_peter', {
                subscription_items: [{
                    item_price_id: 'cbdemo_business-suite-monthly',
                    quantity: 1,
                }],
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
        }; break;
        case 'PUT': {
            const intent = await context.chargebee.paymentIntent.create({
                amount: 10000,
                currency_code: 'EUR',
                customer_id: 'cbdemo_peter',
                gateway_account_id: 'gw_BTLvdtV06HFfy2GI',
                // success_url: '',
                // failure_url: ''
            })

            return data({ intent: intent.payment_intent })
        }
    }

    return data({})
}


export default function renderer() {
    return (
        <ChargebeeProvider pubKey="test_ScuCuJ1Km3hzhDpVTcuVjTNrNpv35860IS" site="seaszn-test">
            <Outlet />
        </ChargebeeProvider>
        // <Elements options={{ mode: 'setup', currency: 'usd' }} stripe={stripe}>
        // </Elements>

    );
}