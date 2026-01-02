import "react-router";
import type Chargebee from "chargebee";
import type { Postgres } from "@boswaves-inc/webstore-core/postgres";
import { CityResponse } from "maxmind";
import type { Countries, Currencies } from "country-to-currency";
import type { CartItem } from "@boswaves-inc/webstore-core";
import type { Smtp } from "@boswaves-inc/webstore-core/smtp";
import type { Jwt } from "@boswaves-inc/webstore-core/jwt";
import type { Auth } from "./auth";
import { SmtpClient } from "@boswaves-inc/smtp-sdk";

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
    smtp: SmtpClient,
    postgres: Postgres
    chargebee: InstanceType<typeof Chargebee>
  }
}