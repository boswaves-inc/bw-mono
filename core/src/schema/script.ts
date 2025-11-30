import { index, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { ScriptType, Status } from "./types";
import { sql, type InferSelectModel } from "drizzle-orm";

export const Script = pgTable("script", (t) => ({
    id: t.uuid().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    type: ScriptType("type").notNull(),
    name: t.text("name").notNull(),
    uuid: t.text("uuid").notNull(),
    image: t.text("image").notNull(),
    status: Status("status").notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}), table => [
    index("script_status_idx").on(table.status),
    uniqueIndex("script_uuid_unq").on(table.uuid).where(sql`status != 'deleted'`),
]);

export type Script = InferSelectModel<typeof Script>