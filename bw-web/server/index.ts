import { createRequestHandler } from "@react-router/express";
import { drizzle } from "drizzle-orm/postgres-js";
import express from "express";
import postgres from "postgres";
import "react-router";

import { PgContext } from "~/database/index";
import * as schema from "~/database/schema";

const router = express();
const client = postgres({
  port: process.env.PG_HOST ? Number(process.env.PG_HOST) : 5432,
  host: process.env.PG_HOST ?? 'localhost',
  username: process.env.PG_USERNAME,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD
});

const db = drizzle(client, { schema });

router.use((_, __, next) => PgContext.run(db, next));

router.use(createRequestHandler({
  // @ts-ignore
  build: () => import("virtual:react-router/server-build"),
}));

export default router