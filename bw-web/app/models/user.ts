import { pgTable } from "drizzle-orm/pg-core";

export const User = pgTable("user_info", (t) => ({
    uid: t.uuid().primaryKey().defaultRandom().notNull(),
    name: t.varchar({ length: 255 }).notNull(),
    email: t.varchar({ length: 255 }).notNull().unique(),
}));

export type User = typeof User.$inferSelect;

// type Analytic = PgInfer<typeof Analytic>;