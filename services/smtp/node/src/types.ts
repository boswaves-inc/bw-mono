import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import schema from '~/schema/index'
import { Smtp } from "~/services/smtp";
import { Logger } from "~/services/logger"

export interface Context {
    smtp: Smtp,
    logger: Logger,
    postgres: PostgresJsDatabase<typeof schema>
}
