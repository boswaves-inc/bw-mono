import type { PaymentIntent } from "chargebee"

export type PaymentType =
    "apple_pay"
    | "card"
    | "ideal"
    | "sofort"
    | "bancontact"
    | "google_pay"
    | "dotpay"
    | "giropay"
    | "upi"
    | "netbanking_emandates"
    | "paypal_express_checkout"
    | "direct_debit"
    | "boleto"
    | "venmo"
    | "amazon_payments"
    | "pay_to"
    | "faster_payments"
    | "sepa_instant_transfer"
    | "klarna_pay_now"
    | "online_banking_poland"
    | "payconiq_by_bancontact"

export interface Token {
    token: string,
    vaultToken: string
}

export interface Field {
    id: string,
    parent: Component,
    fieldType: 'number' | 'cvv' | 'expiry',
    mount: <T extends HTMLElement>(ref: T) => void
    destroy: () => void
}

export interface Component {
    fields: Array<Field>
    tokenize: () => Promise<{ token: string, vaultToken: string }>
    createField: (type: 'number' | 'cvv' | 'expiry') => Field,
    authorizeWith3ds: (
        intent: PaymentIntent,
        data?: {},
        callbacks?: {
            change?: (intent: any) => any
            success?: (intent: any) => any
            challenge?: (intent: any) => any,
            error?: (intent: any, error: any) => any
        }
    ) => Promise<any>
}

export interface $3DSHandler {
    setPaymentIntent: (intent: PaymentIntent) => any
    handleCardPayment: (args: { card: any }) => Promise<any>
}

export interface Client {
    load: <K extends 'components' | '3ds-handler'>(module: K) => Promise<K extends 'components' ? Component : any>,
    load3DSHandler: () => Promise<$3DSHandler>
    createComponent: (type: 'card', options?: any) => Component,
    authorizeWith3ds: (
        intent: PaymentIntent,
        data?: {},
        callbacks?: {
            change?: (intent: any) => any
            success?: (intent: any) => any
            challenge?: (intent: any) => any,
            error?: (intent: any, error: any) => any
        }
    ) => Promise<void>
}

export interface Module {
    init: (options: { site: string, publishableKey: string, enableTestCards?: boolean }) => Client,
}

export interface CardApi {
    component: () => Component | null
}

declare global {
    interface Window {
        Chargebee: Module
    }
}