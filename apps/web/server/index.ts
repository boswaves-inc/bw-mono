import { createRequestHandler } from "@react-router/express";
import express from "express";
import Chargebee from 'chargebee';
import theme, { getTheme } from "./theme";
import postgres, { Postgres } from "@bw/core/postgres";

import "react-router";

if (!process.env.CB_SITE) {
  throw new Error('CB_SITE variable not set')
}

if (!process.env.CB_API_KEY) {
  throw new Error('CB_API_KEY variable not set')
}

if (!process.env.CB_FAMILY) {
  throw new Error('CB_API_KEY variable not set')
}

// const api_router = express()
const app_router = express();

// const tv_client = new TradingView();
const pg_client = new Postgres()
const cb_client = new Chargebee({
  site: process.env.CB_SITE!,
  apiKey: process.env.CB_API_KEY!
})

app_router.use(theme());
app_router.use(postgres({
  port: process.env.PG_HOST ? Number(process.env.PG_HOST) : 5432,
  host: process.env.PG_HOST ?? 'localhost',
  username: process.env.PG_USERNAME,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD
}));

// api_router.use('/api/scripts', scripts({
//   family: process.env.CB_FAMILY,
//   tradingview: tv_client,
//   chargebee: cb_client,
//   postgres: pg_client,
// }))

// api_router.use('/api/coupons', coupons({
//   chargebee: cb_client,
//   postgres: pg_client
// }))

// api_router.use('/api/users', users({
//   chargebee: cb_client,
//   postgres: pg_client
// }))

app_router.use(createRequestHandler({
  build: () => import("virtual:react-router/server-build"),
  getLoadContext: async (req, res) => {
    const theme = await getTheme(req)

    return {
      theme,
      postgres: pg_client,
      chargebee: cb_client
    }
  }
}));

export default app_router