import z from "zod/v4";
import { DsvcRoute } from "./+types/create";

export const meta = ({ }: DsvcRoute.MetaArgs) => ({

})

export const schema = async ({ }: DsvcRoute.SchemaArgs) => z.object({
    start: z.number().optional(),
    end: z.number().optional()
})

export default async ({ body, meta, logger, context }: DsvcRoute.ActionArgs) => {
    // const { _end, _start } = req.query;

    // const start = Number(_start) ?? 0;
    // const end = Number(_end) ?? 10;

    // const data = await postgres.select().from(User).offset(start).limit(end - start)

    // return res.json(data)
    // logger.info({}, 'Hello world')
}