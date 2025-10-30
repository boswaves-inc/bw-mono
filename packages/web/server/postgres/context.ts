import { AsyncLocalStorage } from "async_hooks";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export default new AsyncLocalStorage<PostgresJsDatabase<any>>();