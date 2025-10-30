import "react-router";
import type schema from "~/schema";
import type Chargebee from "chargebee";
import { Postgres } from "./postgres";

declare module "react-router" {
  interface AppLoadContext {
    // theme: 'dark' | 'light';
    postgres: Postgres<typeof schema>;
    chargebee: InstanceType<typeof Chargebee>;
  }
}