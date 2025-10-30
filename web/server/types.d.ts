import "react-router";
import type Chargebee from "chargebee";
import type { Postgres } from "@bw/core/postgres";

declare module "react-router" {
  interface AppLoadContext {
    // theme: 'dark' | 'light';
    postgres: Postgres;
    chargebee: InstanceType<typeof Chargebee>;
  }
}