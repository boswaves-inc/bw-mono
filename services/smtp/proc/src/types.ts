import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { IHeaders } from "kafkajs"
import { Logger } from "~/services/logger"
import schema from '~/schema/index'
import { Smtp } from "./services/smtp";
import { z, ZodObject } from "zod/v4";

export interface Context {
    smtp: Smtp,
    logger: Logger,
    postgres: PostgresJsDatabase<typeof schema>
}
