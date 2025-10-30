import type { NextFunction, Request, Response } from "express";
import { drizzle } from "drizzle-orm/postgres-js";

import context from "./context";
import postgres from 'postgres';

export { Postgres } from './client'

export default <TSchema extends Record<string, unknown> = Record<string, never>>({ schema }: { schema: TSchema }) => {
    const client = postgres({
        port: process.env.PG_HOST ? Number(process.env.PG_HOST) : 5432,
        host: process.env.PG_HOST ?? 'localhost',
        username: process.env.PG_USERNAME,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD
    });

    const store = drizzle(client, { schema });

    return (req: Request, res: Response, next: NextFunction) => {
        context.run(store, next)

        if (!store) {
            throw new Error("DatabaseContext not set");
        }

        return store;
    }
}