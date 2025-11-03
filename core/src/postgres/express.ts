import type { NextFunction, Request, Response } from "express";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres';
import storage from './storage'
import schema from "../schema";

export { Postgres } from '.'

export default (options?: postgres.Options<{}> | undefined) => {
    const client = postgres(options);
    const store = drizzle(client, { schema });

    return (req: Request, res: Response, next: NextFunction) => {
        storage.run(store, next)

        if (!store) {
            throw new Error("DatabaseContext not set");
        }

        return store;
    }
}