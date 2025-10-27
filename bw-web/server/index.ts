import { createRequestHandler } from "@react-router/express";
import postgres from "~/libs/postgres/express";
import express from "express";
import schema from '~/schema'
import theme from "./theme";

import "react-router";
import { themeCookie } from "~/cookie";
import { createContext } from "react-router";

const router = express();

router.use(theme({
  cookie: themeCookie
}));

router.use(postgres({
  schema
}));

router.use(createRequestHandler({
  // @ts-ignore
  build: () => import("virtual:react-router/server-build"),
  getLoadContext: async (req, res) => {
    return {
      theme: 'dark'
    }
  }
}));

export default router