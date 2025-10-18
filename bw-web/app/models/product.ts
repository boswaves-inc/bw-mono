import { pgTable } from "drizzle-orm/pg-core";

export const Product = pgTable("product_info", (t) => ({
    uid: t.uuid().primaryKey().defaultRandom().notNull(),
    name: t.varchar({ length: 255 }).notNull(),
    email: t.varchar({ length: 255 }).notNull().unique(),
}));

export type Product = typeof Product.$inferSelect;

// type Analytic = PgInfer<typeof Analytic>;