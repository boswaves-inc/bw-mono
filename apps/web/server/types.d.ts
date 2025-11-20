import "react-router";
import type Chargebee from "chargebee";
import type { Postgres } from "@bw/core/postgres";
import { CityResponse } from "maxmind";

declare module "react-router" {
  interface AppLoadContext {
    geo: CityResponse | null,
    theme: 'dark' | 'light'
    cart: string | undefined
    postgres: Postgres
    chargebee: InstanceType<typeof Chargebee>
  }
}