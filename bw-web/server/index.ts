import { createRequestHandler } from "@react-router/express";
import drizzle from "drizzle/express";
import express from "express";
import schema from '~/schema'

import "react-router";

const router = express();

router.use(drizzle({ schema }));
router.use(createRequestHandler({
  // @ts-ignore
  build: () => import("virtual:react-router/server-build"),
}));

export default router