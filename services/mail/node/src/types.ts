import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Logger } from "@boswaves-inc/tracing"

import schema from '~/schema/index'
import { Smtp } from "~/services/smtp";

export interface Context {
    smtp: Smtp,
    logger: Logger,
    postgres: PostgresJsDatabase<typeof schema>
}
