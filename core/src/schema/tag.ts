import { index, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { citext, Status } from "./types";
import { sql, type InferSelectModel } from "drizzle-orm";

export const Tag = pgTable("tag", (t) => ({
    id: t.uuid().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: t.text().notNull(),
    slug: t.text("slug").unique().notNull().generatedAlwaysAs(
        sql`lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))`
    ),
    status: Status("status").notNull(),
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull()
}), table => [
    index("tag_info_status_idx").on(table.status),
    uniqueIndex("tag_info_slug_unq").on(table.slug).where(sql`status != 'deleted'`),
]);

export type Tag = InferSelectModel<typeof Tag>