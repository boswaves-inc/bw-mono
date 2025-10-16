import { pgTable } from "drizzle-orm/pg-core";

export const Analytic = pgTable("user_info", (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    name: t.varchar({ length: 255 }).notNull(),
    email: t.varchar({ length: 255 }).notNull().unique(),
}));

type Analytic = Omit<typeof Analytic.$inferInsert, "timestamp" | "id">;