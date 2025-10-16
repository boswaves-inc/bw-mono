import { AsyncLocalStorage } from "node:async_hooks";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export const PgContext = new AsyncLocalStorage<PostgresJsDatabase<typeof schema>>();

export default () => {
  const db = PgContext.getStore();

  if (!db) {
    throw new Error("DatabaseContext not set");
  }

  return db;
}