import "react-router";
import type Chargebee from "chargebee";
import type { Postgres } from "@bw/core/postgres";
import { ipInfo } from 'fast-geoip';

declare module "react-router" {
  interface AppLoadContext {
    postgres: Postgres
    geo: ipInfo | null,
    theme: 'dark' | 'light'
    cart: string | undefined
    chargebee: InstanceType<typeof Chargebee>
  }
}