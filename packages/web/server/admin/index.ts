import express from "express"
import type { Postgres } from "../postgres";
import type Chargebee from "chargebee";

export default <TSchema extends Record<string, unknown>>({ postgres, chargebee }: { postgres: Postgres<TSchema>, chargebee: Chargebee }) => {
    const router = express.Router()

    router.use(express.json());
    router.use(express.urlencoded({ extended: true }))  

    return router;
}