import { createRequestHandler } from "@react-router/express";
import express from "express";
import Chargebee from 'chargebee';
import theme, { getTheme } from "./theme";
import "react-router";
import { Maxmind } from "./maxmind";
import { Auth } from "./auth";
import { Jwt } from "@boswaves-inc/webstore-core/jwt";
import { Smtp } from "@boswaves-inc/smtp-sdk";
import postgres, { Postgres } from "@boswaves-inc/webstore-core/postgres";
import { Directus } from "./directus";

if (!process.env.CDN_HOST) {
  throw new Error('CDN_HOST variable not set')
}

if (!process.env.CDN_TOKEN) {
  throw new Error('CDN_HOST variable not set')
}

if (!process.env.SMTP_BROKERS) {
  throw new Error('SMTP_BROKERS variable not set')
}

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

const pg_client = new Postgres()
const geo_client = await Maxmind.open()

const smtp_client = await Smtp.connect({
  brokers: process.env.SMTP_BROKERS.split(',')
})

// const cdn_client = new Directus({
//   url: process.env.CDN_HOST,
//   token: process.env.CDN_TOKEN
// })

const cb_client = new Chargebee({
  site: process.env.CB_SITE,
  apiKey: process.env.CB_API_KEY
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
  smtp: smtp_client,
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
    // @ts-ignore
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
      // cdn: cdn_client,
      smtp: smtp_client,
      auth: auth_client,
      postgres: pg_client,
      chargebee: cb_client
    }
  }
}));

export default app_router