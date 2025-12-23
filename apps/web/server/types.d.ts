import "react-router";
import type Chargebee from "chargebee";
import type { Postgres } from "@bw/core/postgres";
import { CityResponse } from "maxmind";
import type { Countries, Currencies } from "country-to-currency";
import type { CartItem } from "@bw/core";
import type { Smtp } from "@bw/core/smtp";
import type { Jwt } from "@bw/core/jwt";

declare module "react-router" {
  interface AppLoadContext {
    geo: {
      country: Countries,
      currency: Currencies
    },
    cart: {
      id: string;
      uid: string | null;
      cart_item: {
        quantity: number,
        item_price: string
      }[];
    }
    theme: 'dark' | 'light'
    jwt: Jwt,
    smtp: Smtp,
    postgres: Postgres
    chargebee: InstanceType<typeof Chargebee>
  }
}