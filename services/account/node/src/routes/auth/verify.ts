import z from "zod/v4";
import { SvcRoute } from "./+types/verify";
import { User } from "~/schema/user";

export const meta = ({ }: SvcRoute.MetaArgs) => ({

})

export const schema = async ({ }: SvcRoute.SchemaArgs) => z.object({
    email: z.email(),
    last_name: z.email(),
    first_name: z.email(),
})

export default async ({ body, context }: SvcRoute.ActionArgs) => {

    //     const data = await schema.parseAsync(req.body)
    const [result] = await context.postgres.insert(User)
        .values(body)
        .returning()

    // await chargebee.customer.create({
    //     id: result.uid,
    //     email: result.email,
    //     first_name: result.first_name,
    //     last_name: result.last_name,
    // });

    return result
}