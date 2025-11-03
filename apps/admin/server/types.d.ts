import "react-router";
import type Chargebee from "chargebee";
import type { Postgres } from "./postgres";

declare module "react-router" {
  interface AppLoadContext {
    postgres: Postgres;
    chargebee: InstanceType<typeof Chargebee>;
  }
}