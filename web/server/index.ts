import { createRequestHandler } from "@react-router/express";
import Chargebee from 'chargebee';
import express from "express";
// import chargebee from "./chargebee";
import theme, { getTheme } from "./theme";
// import schema from '~/core/models'
// import postgres, { Postgres } from "./postgres";


import "react-router";
import postgres, { Postgres } from "./postgres";

if (!process.env.CB_SITE) {
  throw new Error('CB_SITE variable not set')
}

if (!process.env.CB_API_KEY) {
  throw new Error('CB_API_KEY variable not set')
}

const store_router = express();
const studio_router = express();

const pg_client = new Postgres()
const cb_client = new Chargebee({
  site: process.env.CB_SITE!,
  apiKey: process.env.CB_API_KEY!
})

store_router.use(theme());
store_router.use(postgres({
  port: process.env.PG_HOST ? Number(process.env.PG_HOST) : 5432,
  host: process.env.PG_HOST ?? 'localhost',
  username: process.env.PG_USERNAME,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD
}));

// router.use('/chargebee', chargebee({ postgres: pg_client }))
// router.use('/admin', admin({ postgres: pg_client, chargebee: cb_client }))

studio_router.use(createRequestHandler({
  build: () => import("virtual:react-router/server-build"),
  getLoadContext: async (req, res) => {
    return {
      theme: 'dark',
      postgres: pg_client,
      chargebee: cb_client
    }
  }
}));

store_router.use(createRequestHandler({
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

export default store_router