import { createRequestHandler } from "@react-router/express";
import express from "express";
import Chargebee from 'chargebee';
import theme, { getTheme } from "./theme";
import postgres, { Postgres } from "@boswaves/core/postgres";
import "react-router";
import { Maxmind } from "./maxmind";
import { Jwt } from "@boswaves/core/jwt";
import { Auth } from "./auth";

if (!process.env.CB_SITE) {
  throw new Error('CB_SITE variable not set')
}

if (!process.env.CB_API_KEY) {
  throw new Error('CB_API_KEY variable not set')
}

if (!process.env.CB_FAMILY) {
  throw new Error('CB_API_KEY variable not set')
}

if (!process.env.JWT_PRIV_KEY) {
  throw new Error('JWT_PRIV_KEY variable not set')
}

if (!process.env.JWT_PUB_KEY) {
  throw new Error('JWT_PUB_KEY variable not set')
}

const geo_client = await Maxmind.init()
const pg_client = new Postgres()

const cb_client = new Chargebee({
  site: process.env.CB_SITE!,
  apiKey: process.env.CB_API_KEY!
})

const jwt_client = new Jwt({
  algorithm: 'RS256',
  keys: {
    private_key: process.env.JWT_PRIV_KEY,
    public_key: process.env.JWT_PUB_KEY
  }
})

const auth_client = new Auth({
  chargebee: cb_client,
  postgres: pg_client,
  jwt: jwt_client,
})

const app_router = express();

app_router.set('trust proxy', 1)

app_router.use(theme());

app_router.use(postgres({
  port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
  host: process.env.PG_HOST ?? 'localhost',
  username: process.env.PG_USERNAME,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD
}));

app_router.use(createRequestHandler({
  build: () => {
    return import("virtual:react-router/server-build")
  },
  getLoadContext: async (req, res) => {
    const theme = await getTheme(req)
    const geo = geo_client.location(req)

    return {
      geo,
      cart: {
        id: '00000000-0000-0000-0000-000000000000',
        uid: null,
        cart_item: [],
      },
      theme,
      jwt: jwt_client,
      auth: auth_client,
      postgres: pg_client,
      chargebee: cb_client
    }
  }
}));

export default app_router