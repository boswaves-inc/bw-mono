import '@boswaves-inc/kafka-router'

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