import '@boswaves-inc/kafka-router'
import '@boswaves-inc/nats-router'

import { Smtp } from './services/smtp'
import { Logger } from './services/logger'
import { Postgres } from './services/postgres'

declare module "@boswaves-inc/kafka-router" {
    interface KafkaLoadContext {
        smtp: Smtp
        logger: Logger
        postgres: Postgres
    }
}

declare module "@boswaves-inc/nats-router" {
    interface NatsLoadContext {
        smtp: Smtp
        postgres: Postgres
    }
}