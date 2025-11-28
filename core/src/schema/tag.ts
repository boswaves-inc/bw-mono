import { index, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { citext, Status } from "./types";
import { sql, type InferSelectModel } from "drizzle-orm";

export const Tag = pgTable("tag", (t) => ({
    id: t.uuid().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    value: citext("value").notNull(),
    status: Status("status").notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull()
}), table => [
    index("tag_info_status_idx").on(table.status),
    uniqueIndex("tag_info_value_unq").on(table.value).where(sql`status != 'deleted'`),
]);

export type Tag = InferSelectModel<typeof Tag>