import { data } from "react-router"
import type { Route } from "./+types/api.checkout"

export async function action({ context }: Route.ActionArgs) {
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