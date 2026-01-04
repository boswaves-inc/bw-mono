import { sql, type InferEnum, type InferSelectModel } from "drizzle-orm";
import { index, pgEnum, pgTable } from "drizzle-orm/pg-core";

// export const EmailStatus = pgEnum('email_status', [
//     'failed',
//     'pending',
//     'processed',
// ]);

// export const EmailTemplate = pgTable("email_templates", t => ({
//     id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
//     name: t.text().notNull(),
//     slug: t.text("slug").notNull().generatedAlwaysAs(
//         sql`lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))`
//     ),
//     subject: t.text('subject').notNull(),
//     created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
//     updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
// }), table => [
//     index('emails_slug_idx').on(table.slug),
// ]);

// export const Email = pgTable("emails", t => ({
//     id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
//     sender: t.text('sender').notNull(),
//     subject: t.text('subject').notNull(),
//     recipient: t.text('recipient').notNull(),
//     template: t.uuid().references(() => EmailTemplate.id, {
//         onDelete: 'set null',
//         onUpdate: 'cascade'
//     }),
//     status: EmailStatus('status').default('pending').notNull(),
//     created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
//     processed_at: t.timestamp({ withTimezone: true }),
// }), table => [
//     index('email_queue_status_idx').on(table.status),
//     index('email_queue_created_at_idx').on(table.created_at),
// ]);

// // export const EmailEvent = pgTable("email_events", t => ({
// //     id: t.uuid().primaryKey().notNull().references(() => EmailQueue.id, {
// //         onDelete: 'cascade',
// //         onUpdate: 'cascade'
// //     }),
// //     created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
// // }));


// export type EmailTemplate = InferSelectModel<typeof EmailTemplate>
// export type Email = InferSelectModel<typeof Email>
// // export type EmailEvent = InferSelectModel<typeof EmailEvent>

// export type EmailStatus = InferEnum<typeof EmailStatus>
