import type { InferEnum } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const UserProvider = pgEnum('user_provider', [
    'internal',
    'google'
])

export const User = pgTable("user_info", (t) => ({
    // Unique id
    uid: t.uuid().primaryKey().defaultRandom().notNull(),

    // User Info
    name: t.varchar({ length: 255 }).notNull(),
    email: t.varchar({ length: 255 }).unique().notNull(),

    // Authentication provider
    provider: UserProvider().default('internal').notNull(),
    provider_id: t.varchar({ length: 255 }).unique(),

    // External services
    chargebee_id: t.varchar({ length: 255 }).unique().notNull(),
    tradingview_id: t.varchar({ length: 255 }).unique(),

    // Timestamps
    created_at: t.timestamp().defaultNow().notNull(),
    updated_at: t.timestamp().defaultNow().notNull(),
}));

export const UserCredentials = pgTable("user_credentials", (t) => ({
    uid: t.uuid().primaryKey().references(() => User.uid),
}));

export type User = typeof User.$inferSelect;
export type UserProvider = InferEnum<typeof UserProvider>
export type UserCredentials = typeof UserCredentials.$inferSelect;

// type Analytic = PgInfer<typeof Analytic>;