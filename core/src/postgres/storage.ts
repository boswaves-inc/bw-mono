import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { AsyncLocalStorage } from "async_hooks";

export default new AsyncLocalStorage<PostgresJsDatabase<any>>();
