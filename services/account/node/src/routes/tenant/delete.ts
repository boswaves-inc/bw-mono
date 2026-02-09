import z from "zod/v4";
import { SvcRoute } from "./+types/delete";

export const meta = ({ }: SvcRoute.MetaArgs) => ({

})

export const schema = async ({ }: SvcRoute.SchemaArgs) => z.object({
})

export default async ({ }: SvcRoute.ActionArgs) => {
    throw new Error('not implemented')
}