import { createRequestHandler } from "@react-router/express";
import Chargebee from 'chargebee';
import express from "express";
import schema from '~/schema'
import chargebee from "./chargebee";
import theme, { getTheme } from "./theme";
import postgres, { Postgres } from "./postgres";

import "react-router";
import admin from "./admin";

if (!process.env.CB_SITE) {
  throw new Error('CB_SITE variable not set')
}

if (!process.env.CB_API_KEY) {
  throw new Error('CB_API_KEY variable not set')
}

const router = express();

const pg_client = new Postgres<typeof schema>()
const cb_client = new Chargebee({
  site: process.env.CB_SITE!,
  apiKey: process.env.CB_API_KEY!
})

router.use(theme());
router.use(postgres({ schema }));

router.use('/chargebee', chargebee({ postgres: pg_client }))
router.use('/admin', admin({ postgres: pg_client, chargebee: cb_client }))

router.use(createRequestHandler({
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

export default router