import { pgTable } from "drizzle-orm/pg-core";

export const Analytic = pgTable("user_info", (t) => ({
    uid: t.uuid().primaryKey().defaultRandom().notNull(),
    name: t.varchar({ length: 255 }).notNull(),
    email: t.varchar({ length: 255 }).notNull().unique(),
}));


// type Analytic = PgInfer<typeof Analytic>;
// type Analytic = Omit<typeof Analytic.$inferInsert, "timestamp" | "id">;