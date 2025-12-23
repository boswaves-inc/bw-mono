import { sql, type InferEnum } from "drizzle-orm";
import { check, index, pgEnum, pgSchema, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { citext, OtpType } from "../shop/types";
import { User, UserProvider } from "./user";


export const Session = pgTable('sessions', t => ({
    id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    uid: t.uuid().notNull().references(() => User.uid, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    nonce: t.integer('nonce').default(0).notNull(),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    expired_at: t.timestamp({ withTimezone: true }).notNull(),
    revoked_at: t.timestamp({ withTimezone: true }),
}), table => [
    index('sessions_uid_idx').on(table.uid),
    index('sessions_expired_at_idx').on(table.expired_at), // For cleanup
])

export const SessionOAuth = pgTable('session_oauth', t => ({
    id: t.uuid().primaryKey().references(() => Session.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    scope: t.text('scope'),
    provider: UserProvider('provider').notNull(),
    access_token: t.text('access_token').notNull(),
    refresh_token: t.text('refresh_token'),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
    expired_at: t.timestamp({ withTimezone: true }).notNull(),
}), table => [
    index('session_oauth_uid_idx').on(table.id),
])

export const SessionEvent = pgTable('session_events', t => ({
    id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    sid: t.uuid().notNull().references(() => Session.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    emitted_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
}), table => [
    index('session_events_sid_idx').on(table.sid),
    index('session_events_emitted_at_idx').on(table.emitted_at),
])

export type SessionEvent = typeof SessionEvent.$inferSelect;
export type SessionOAuth = typeof SessionOAuth.$inferSelect;
export type Session = typeof Session.$inferSelect;