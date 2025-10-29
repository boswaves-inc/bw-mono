import { data, type ActionFunctionArgs } from "react-router"

export async function action({ context }: ActionFunctionArgs) {
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