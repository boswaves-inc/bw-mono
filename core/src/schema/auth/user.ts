import { sql, type InferEnum } from "drizzle-orm";
import { check, index, pgEnum, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { citext } from "../types";


export const UserProvider = pgEnum('user_provider', [
    'internal',
    'google'
])

export const UserStatus = pgEnum('user_status', [
    'deleted',
    'pending',
    'active'
])


export const UserOtpScope = pgEnum('user_otp_scope', [
    'verify_account',
    'reset_password'
])

export const UserRole = pgEnum('user_role', [
    'admin',
    'user'
])

export const User = pgTable("users", (t) => ({
    uid: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    role: UserRole('role').default('user').notNull(),
    status: UserStatus('status').default('pending').notNull(),

    // User Info
    email: citext('email').unique().notNull(),
    first_name: t.varchar({ length: 255 }).notNull(),
    last_name: t.varchar({ length: 255 }).notNull(),

    // Authentication provider
    provider: UserProvider('provider').default('internal').notNull(),
    provider_id: t.varchar({ length: 255 }).unique(),

    // Timestamps
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}), table => [
    index('users_email_idx').on(table.email),
    index('users_status_idx').on(table.status),
    index('users_provider_id_idx').on(table.provider, table.provider_id),
    check('users_provider_id_check', sql`(${table.provider} = 'internal' AND ${table.provider_id} IS NULL) OR (${table.provider} != 'internal' AND ${table.provider_id} IS NOT NULL)`),
]);

export const UserCredentials = pgTable("user_credentials", (t) => ({
    uid: t.uuid().primaryKey().references(() => User.uid, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    password: t.text().notNull(),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}), table => [
    index('user_credentials_uid_idx').on(table.uid),
]);

export const UserOtp = pgTable('user_otps', t => ({
    id: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    uid: t.uuid().notNull().references(() => User.uid, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    scope: UserOtpScope('scope').notNull(),
    hash: t.text('hash').notNull(),
    attempts: t.integer('attempts').default(0).notNull(),
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    expires_at: t.timestamp({ withTimezone: true }).notNull(),
    consumed_at: t.timestamp({ withTimezone: true }),
}), table => [
    index('user_otps_uid_type_idx').on(table.uid, table.scope),
    index('user_otps_expires_at_idx').on(table.expires_at),
    uniqueIndex('user_otps_active_unique_idx')
        .on(table.uid, table.scope)
        .where(sql`${table.consumed_at} IS NULL`),
])

export type UserRole = InferEnum<typeof UserRole>
export type UserStatus = InferEnum<typeof UserStatus>
export type UserOtpScope = InferEnum<typeof UserOtpScope>
export type UserProvider = InferEnum<typeof UserProvider>

export type User = typeof User.$inferSelect;
export type UserOtp = typeof UserOtp.$inferSelect;
export type UserCredentials = typeof UserCredentials.$inferSelect;