import { sql } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const EmailStatus = pgEnum('email_status', [
    'failed',
    'pending',
    'processed',
]);

export const Email = pgTable("emails", t => ({
    id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    name: t.text().notNull(),
    slug: t.text("slug").notNull().generatedAlwaysAs(
        sql`lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))`
    ),
    subject: t.text('subject').notNull(),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}));

export const EmailQueue = pgTable("email_queue", t => ({
    id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    ref: t.uuid().references(() => Email.id, {
        onDelete: 'set null',
        onUpdate: 'cascade'
    }),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}));

export const EmailEvent = pgTable("email_events", t => ({
    id: t.uuid().primaryKey().notNull().references(() => EmailQueue.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
}));