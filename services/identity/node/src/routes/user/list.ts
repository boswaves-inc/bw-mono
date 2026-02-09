import z from "zod/v4";
import { DsvcRoute } from "./+types/list";

export const meta = ({ }: DsvcRoute.MetaArgs) => ({

})

export const schema = async ({ }: DsvcRoute.SchemaArgs) => z.object({
})

export default async ({ body, meta, logger, context }: DsvcRoute.ActionArgs) => {
    logger.info({}, 'Hello world')
}