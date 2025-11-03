import { data } from "react-router"
import type { Route } from "./+types/_store.checkout.intent"
import { eq } from 'drizzle-orm';
import type { User } from "~/core/models/user";

export async function action({ request, context }: Route.ActionArgs) {
    const form = await request.formData()
    const user: User = { chargebee_id: 'cbdemo_peter' } as User;

    // const cart = context.postgres.select()
    //     .from(CartItem)
    //     .where(eq(CartItem.uid, user.uid));

    const intent = await context.chargebee.paymentIntent.create({
        amount: 10000,
        currency_code: 'EUR',
        customer_id: user.chargebee_id,
        gateway_account_id: 'gw_BTLvdtV06HFfy2GI',
        // payment_method_type: 'apple_pay'
        // success_url: '',
        // failure_url: ''
    })

    return data({ intent: intent.payment_intent })
}