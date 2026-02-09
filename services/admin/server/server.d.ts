import "react-router";
import type Chargebee from "chargebee";
import type { Postgres } from "@boswaves-inc/webstore-core/postgres";
import type { Theme } from "~/components/theme";

declare module "react-router" {
  interface AppLoadContext {
    theme: Theme;
    postgres: Postgres;
    chargebee: InstanceType<typeof Chargebee>;
  }
}