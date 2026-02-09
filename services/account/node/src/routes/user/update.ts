import z from "zod/v4";
import { SvcRoute } from "./+types/update";

export const meta = ({ }: SvcRoute.MetaArgs) => ({

})

export const schema = async ({ }: SvcRoute.SchemaArgs) => z.object({
})

export default async ({ body, meta, logger, context }: SvcRoute.ActionArgs) => {
    logger.info({}, 'Hello world')
}