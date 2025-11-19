import { createRequestHandler } from "@react-router/express";
import express from "express";
import Chargebee from 'chargebee';
import theme, { getTheme } from "./theme";
import postgres, { Postgres } from "@bw/core/postgres";
import geoip from 'fast-geoip';

import "react-router";
import { getSession } from "~/utils/session";
import { cartSession } from "~/cookie";

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

app_router.set('trust proxy', 1)

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
    geoip.enableCache()

    const [theme, session] = await Promise.all([
      getTheme(req),
      cartSession.getSession(req.headers.cookie)
    ])

    const cart = session.get('id')
    const geo = await geoip.lookup(req.ip || '')

    return {
      geo,
      cart,
      theme,
      postgres: pg_client,
      chargebee: cb_client
    }
  }
}));

export default app_router