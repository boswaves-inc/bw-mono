import { createRequestHandler } from "@react-router/express";
import express from "express";
import Chargebee from 'chargebee';
import theme, { getTheme } from "./theme";
import postgres, { Postgres } from "@bw/core/postgres";
import maxmind, { type CountryResponse } from 'maxmind';
import { Smtp } from '@bw/core/smtp'
// import ss from './geolite/country.mmdb'
import { SignJWT, jwtVerify, importPKCS8, importSPKI } from 'jose';

import "react-router";
import {  cookieSession } from "~/cookie";
import { Maxmind } from "./maxmind";
import type { Countries, Currencies } from "country-to-currency";
import countryToCurrency from "country-to-currency";
import { Cart, CartItem } from "@bw/core";
import { Jwt } from "@bw/core/jwt";
import { eq, isNotNull } from "drizzle-orm";
import { json_agg_object } from "@bw/core/utils/drizzle";
import type { AppLoadContext } from "react-router";
import { join } from "path";

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

// const api_router = express()

const geo_client = await Maxmind.open()
const pg_client = new Postgres()

const jwt_client = new Jwt({
  algorithm: 'RS256',
  keys: {
    private_key: process.env.JWT_PRIV_KEY,
    public_key: process.env.JWT_PUB_KEY
  }
})

const smtp_client = new Smtp({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'francesca.bailey@ethereal.email',
    pass: 'eahGbsXKCBct3GEW5S'
  }
})

const cb_client = new Chargebee({
  site: process.env.CB_SITE!,
  apiKey: process.env.CB_API_KEY!
})

const app_router = express();

app_router.set('trust proxy', 1)

app_router.use(theme());

app_router.use(postgres({
  port: process.env.PG_HOST ? Number(process.env.PG_HOST) : 5432,
  host: process.env.PG_HOST ?? 'localhost',
  username: process.env.PG_USERNAME,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD
}));

app_router.use(createRequestHandler({
  build: () => import("virtual:react-router/server-build"),
  getLoadContext: async (req, res) => {
    const [theme, session] = await Promise.all([
      getTheme(req), cookieSession.getSession(req.headers.cookie)
    ])

    const cart = await new Promise<AppLoadContext['cart']>(async resolve => {
      const cookie = session.get('cart')

      if (cookie) {
        const result = await pg_client.select({
          id: Cart.id,
          uid: Cart.uid,
          cart_item: json_agg_object({
            quantity: CartItem.quantity,
            item_price: CartItem.item_price,
          }, isNotNull(CartItem.id)).as('items')
        }).from(Cart)
          .groupBy(Cart.id)
          .innerJoin(CartItem, eq(Cart.id, CartItem.id))
          .where(eq(Cart.id, cookie))
          .limit(1).then(x => x.at(0))

        if (result == undefined) {
          session.unset('cart')

          res.cookie('Set-Cookie', await cookieSession.commitSession(session))
        }
        else {
          return resolve(result)
        }
      }

      return resolve({
        id: '00000000-0000-0000-0000-000000000000',
        uid: null,
        cart_item: [],
      })
    })

    const geo = await new Promise<{ country: Countries, currency: Currencies }>(resolve => {
      const location = geo_client.city.get(req.ip || '');

      if (location?.country != undefined) {
        const country = location.country.iso_code as Countries;

        // check if currency is accepted in chargebee, if not, fallback to usd

        const currency = countryToCurrency[country];

        resolve({ country, currency })
      }

      return resolve({ country: 'US', currency: 'USD' })
    });

    return {
      geo,
      cart,
      theme,
      jwt: jwt_client,
      smtp: smtp_client,
      postgres: pg_client,
      chargebee: cb_client
    }
  }
}));

export default app_router