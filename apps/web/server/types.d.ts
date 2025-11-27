import "react-router";
import type Chargebee from "chargebee";
import type { Postgres } from "@bw/core/postgres";
import { CityResponse } from "maxmind";
import type { Countries, Currencies } from "country-to-currency";
import type { CartData } from "@bw/core";

declare module "react-router" {
  interface AppLoadContext {
    geo: {
      country: Countries,
      currency: Currencies
    },
    cart: CartData | undefined
    theme: 'dark' | 'light'
    postgres: Postgres
    chargebee: InstanceType<typeof Chargebee>
  }
}