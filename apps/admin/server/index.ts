import { createRequestHandler } from "@react-router/express";
import express from "express";
import Chargebee from 'chargebee';
import postgres, { Postgres } from "@bw/core/postgres";
import { TradingView } from "@bw/core/tradingview";

import "react-router";
import theme, { getTheme } from "./theme";

import plans from "./api/plans";
import tags from "./api/tags";
import users from "./api/users";

if (!process.env.CB_SITE) {
  throw new Error('CB_SITE variable not set')
}

if (!process.env.CB_FAMILY) {
  throw new Error('CB_FAMILY variable not set')
}

if (!process.env.CB_API_KEY) {
  throw new Error('CB_API_KEY variable not set')
}

const router = express();

const tv_client = new TradingView();
const pg_client = new Postgres()
const cb_client = new Chargebee({
  site: process.env.CB_SITE,
  apiKey: process.env.CB_API_KEY
})

router.use(postgres({
  port: process.env.PG_HOST ? Number(process.env.PG_HOST) : 5432,
  host: process.env.PG_HOST ?? 'localhost',
  username: process.env.PG_USERNAME,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD
}));

router.use(theme())

router.use('/api/plans', plans({
  family: process.env.CB_FAMILY,
  tradingview: tv_client,
  chargebee: cb_client,
  postgres: pg_client,
}))

router.use('/api/tags', tags({
  tradingview: tv_client,
  postgres: pg_client,
}))

router.use('/api/users', users({
  chargebee: cb_client,
  postgres: pg_client
}))

router.use(createRequestHandler({
  // @ts-ignore
  build: () => import("virtual:react-router/server-build"),
  getLoadContext: async (req, res) => {
    const theme = await getTheme(req)

    return {
      chargebee: cb_client,
      postgres: pg_client,
      theme,
    }
  }
}));

export default router