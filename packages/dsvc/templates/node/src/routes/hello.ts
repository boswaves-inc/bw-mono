import z from "zod/v4";
import { NatsRoute } from "./+types/hello";

export const meta = ({ }: NatsRoute.MetaArgs) => ({

})

export const schema = async ({ }: NatsRoute.SchemaArgs) => z.object({
})

export default async ({ body, meta, logger, context }: NatsRoute.ActionArgs) => {
    logger.info({}, 'Hello world')
}