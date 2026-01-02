import { index, pgEnum, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { ItemStatus } from "./types";
import { sql, type InferEnum, type InferSelectModel } from "drizzle-orm";


export const ScriptType = pgEnum('script_type', [
    "library",
    "indicator",
    "screener",
    "strategy"
])


export const Script = pgTable("scripts", (t) => ({
    id: t.uuid().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    type: ScriptType("type").notNull(),
    name: t.text("name").notNull(),
    uuid: t.text("uuid").notNull(),
    image: t.text("image").notNull(),
    status: ItemStatus("status").notNull(),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}), table => [
    index("script_status_idx").on(table.status),
    uniqueIndex("script_uuid_unq").on(table.uuid).where(sql`status != 'deleted'`),
]);

export type ScriptType = InferEnum<typeof ScriptType>
export type Script = InferSelectModel<typeof Script>