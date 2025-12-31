import "react-router";
import type Chargebee from "chargebee";
import type { Postgres } from "@boswaves/core/postgres";
import { CityResponse } from "maxmind";
import type { Countries, Currencies } from "country-to-currency";
import type { CartItem } from "@boswaves/core";
import type { Smtp } from "@boswaves/core/smtp";
import type { Jwt } from "@boswaves/core/jwt";
import type { Auth } from "./auth";

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
    auth: Auth,
    postgres: Postgres
    chargebee: InstanceType<typeof Chargebee>
  }
}