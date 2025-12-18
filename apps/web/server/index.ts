import { createRequestHandler } from "@react-router/express";
import express from "express";
import Chargebee from 'chargebee';
import theme, { getTheme } from "./theme";
import postgres, { Postgres } from "@bw/core/postgres";
import maxmind, { type CountryResponse } from 'maxmind';

// import ss from './geolite/country.mmdb'

import "react-router";
import { getSession } from "~/utils/session";
import { cartSession } from "~/cookie";
import { Maxmind } from "./maxmind";
import type { Countries, Currencies } from "country-to-currency";
import countryToCurrency from "country-to-currency";
import { Cart, CartItem } from "@bw/core";
import { eq, isNotNull } from "drizzle-orm";
import { json_agg_object } from "@bw/core/utils/drizzle.ts";
import type { AppLoadContext } from "react-router";

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
// const geo_client = await maxmind.open<CountryResponse>('./geolite/country.mmdb')
const geo_client = await Maxmind.open()

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
    const [theme, session] = await Promise.all([
      getTheme(req), cartSession.getSession(req.headers.cookie)
    ])

    const cart = await new Promise<AppLoadContext['cart']>(async resolve => {
      const cookie = session.get('id')

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
          session.unset('id')

          res.cookie('Set-Cookie', await cartSession.commitSession(session))
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
      postgres: pg_client,
      chargebee: cb_client
    }
  }
}));

export default app_router