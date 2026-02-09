import z from "zod/v4";
import { DsvcRoute } from "./+types/list";

export const meta = ({ }: DsvcRoute.MetaArgs) => ({

})

export const schema = async ({ }: DsvcRoute.SchemaArgs) => z.object({
    start: z.number().optional(),
    end: z.number().optional()
})

export default async ({ body, meta, logger, context }: DsvcRoute.ActionArgs) => {
    // const { end: _end, start: _start } = body;

    // const start = Number(_start) ?? 0;
    // const end = Number(_end) ?? 10;

    // return await context.postgres.select().from(User).offset(start).limit(end - start)
}