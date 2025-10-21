import type { PaymentIntent } from "chargebee";
import type { Component, Token } from "../types";

export interface CardApi {
    component: () => Component | null
    // tokenize: () => Promise<Token>,
    // components: () => any
}
