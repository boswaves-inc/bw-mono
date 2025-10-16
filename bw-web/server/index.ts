import { createRequestHandler } from "@react-router/express";
import { drizzle } from "drizzle-orm/postgres-js";
import express from "express";
import postgres from "postgres";
import "react-router";

import { DatabaseContext } from "~/database/context";
import * as schema from "~/database/schema";

const app = express();

const client = postgres();
const db = drizzle(client, { schema });

app.use((_, __, next) => DatabaseContext.run(db, next));

app.use(createRequestHandler({
  // @ts-ignore
  build: () => import("virtual:react-router/server-build"),
}));

export default app