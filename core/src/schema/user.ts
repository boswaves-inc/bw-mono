import type { InferEnum } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { citext } from "./types";

export const UserProvider = pgEnum('user_provider', [
    'internal',
    'google'
])

export const UserRole = pgEnum('user_role', [
    'admin',
    'user'
])

export const User = pgTable("user", (t) => ({
    // Unique id
    uid: t.uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    cbid: t.text().notNull(),

    role: UserRole().default('user').notNull(),

    // User Info
    email: citext('email').unique().notNull(),
    first_name: t.varchar({ length: 255 }).notNull(),
    last_name: t.varchar({ length: 255 }).notNull(),

    // Authentication provider
    provider: UserProvider().default('internal').notNull(),
    provider_id: t.varchar({ length: 255 }).unique(),

    // // External services
    // chargebee_id: t.varchar({ length: 255 }).unique().notNull(),
    // tradingview_id: t.varchar({ length: 255 }).unique(),

    // Timestamps
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}));

export const UserCredentials = pgTable("user_credentials", (t) => ({
    uid: t.uuid().primaryKey().references(() => User.uid),
    password: t.text().notNull(),
}));

export type User = typeof User.$inferSelect;
export type UserRole = InferEnum<typeof UserRole>
export type UserProvider = InferEnum<typeof UserProvider>
export type UserCredentials = typeof UserCredentials.$inferSelect;

// // type Analytic = PgInfer<typeof Analytic>;