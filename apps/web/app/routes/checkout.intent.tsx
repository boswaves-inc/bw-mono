import { data } from "react-router"
import type { Route } from "./+types/checkout.intent"
import { eq } from 'drizzle-orm';
import type { User } from "@boswaves/core";

export async function action({ request, context }: Route.ActionArgs) {
    const form = await request.formData()
    const user: User = { cbid: 'cbdemo_peter' } as any;

    // const cart = context.postgres.select()
    //     .from(CartItem)
    //     .where(eq(CartItem.uid, user.uid));

    const intent = await context.chargebee.paymentIntent.create({
        amount: 10000,
        currency_code: 'EUR',
        customer_id: user.cbid,
        gateway_account_id: 'gw_BTLvdtV06HFfy2GI',
        // payment_method_type: 'apple_pay'
        // success_url: '',
        // failure_url: ''
    })

    return data({ intent: intent.payment_intent })
}