import type { TableConfig } from "drizzle-orm/gel-core";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";

// type Analytic = Omit<typeof Analytic.$inferInsert, "timestamp" | "id">;

export type PgInsert<T extends PgTableWithColumns<any>> = T['$inferInsert'];
export type PgOutput<T extends PgTableWithColumns<any>> = T['$inferOutput'];