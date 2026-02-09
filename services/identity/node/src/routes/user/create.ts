import z from "zod/v4";
import { DsvcRoute } from "./+types/create";
import { User } from "~/schema/user";

export const meta = ({ }: DsvcRoute.MetaArgs) => ({

})

export const schema = async ({ }: DsvcRoute.SchemaArgs) => z.object({
    email: z.email(),
    last_name: z.email(),
    first_name: z.email(),
})

export default async ({ body, logger, context }: DsvcRoute.ActionArgs) => {

    //     const data = await schema.parseAsync(req.body)
    const [result] = await context.postgres.insert(User)
        .values(body)
        .returning()

    await chargebee.customer.create({
        id: result.uid,
        email: result.email,
        first_name: result.first_name,
        last_name: result.last_name,
    });

    //     return res.json(result).sendStatus(200)

    logger.info({}, 'Hello world')
}