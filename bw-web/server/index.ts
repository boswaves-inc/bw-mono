import { createRequestHandler } from "@react-router/express";
import postgres from "~/libs/postgres/express";
import express from "express";
import schema from '~/schema'

import "react-router";

const router = express();

router.use(postgres({
  schema
}));

// router.use(chargebee({

// }));

router.use(createRequestHandler({
  // @ts-ignore
  build: () => import("virtual:react-router/server-build"),
}));

export default router