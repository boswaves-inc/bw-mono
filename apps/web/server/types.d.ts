import "react-router";
import type Chargebee from "chargebee";
import type { Postgres } from "@bw/core/postgres";
import { CityResponse } from "maxmind";
import type { Countries, Currencies } from "country-to-currency";

declare module "react-router" {
  interface AppLoadContext {
    geo: {
      country: Countries,
      currency: Currencies
    },
    cart: {
      id: string;
      uid: string | null;
      items: {
        quantity: number;
        item_price: string;
      }[];
    }
    theme: 'dark' | 'light'
    postgres: Postgres
    chargebee: InstanceType<typeof Chargebee>
  }
}