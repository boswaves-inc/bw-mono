import '@boswaves-inc/nats-router'

import { Smtp } from './services/smtp'
import { Logger } from './services/logger'
import { Postgres } from './services/postgres'


declare module "@boswaves-inc/nats-router" {
    interface NatsLoadContext {
        smtp: Smtp
        postgres: Postgres
    }
}

declare module "virtual:smtp/elements" {
    export const element_map: { [key: string]: import('./components/types').ElementInfo }
    export const elements: { module: import('./components/types').ElementInfo; key: string; }[]
}