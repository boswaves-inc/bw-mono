import "react-router";
import type { Postgres } from "~/libs/postgres";
import type schema from "~/schema";
import type Chargebee from "chargebee";

declare module "react-router" {
  interface AppLoadContext {
    // theme: 'dark' | 'light';
    postgres: Postgres<typeof schema>;
    chargebee: InstanceType<typeof Chargebee>;
  }
}