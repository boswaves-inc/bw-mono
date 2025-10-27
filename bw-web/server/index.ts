import { createRequestHandler } from "@react-router/express";
import Chargebee from 'chargebee';
import postgres from "~/libs/postgres/express";
import express from "express";
import schema from '~/schema'
import theme, { getTheme } from "~/libs/theme/express";

import { themeCookie } from "~/cookie";
import { Postgres } from "~/libs/postgres";

import "react-router";

if (!process.env.CB_SITE) {
  throw new Error('CB_SITE variable not set')
}

if (!process.env.CB_API_KEY) {
  throw new Error('CB_API_KEY variable not set')
}

const router = express();

router.use(theme());

router.use(postgres({
  schema
}));

router.use(createRequestHandler({
  // @ts-ignore
  build: () => import("virtual:react-router/server-build"),
  getLoadContext: async (req, res) => {
    const theme = await getTheme(req)

    const postgres = new Postgres<typeof schema>()

    const chargebee = new Chargebee({
      site: process.env.CB_SITE!,
      apiKey: process.env.CB_API_KEY!
    })

    return {
      theme,
      postgres,
      chargebee
    }
  }
}));

export default router