import z from "zod/v4";
import { DsvcRoute } from "./+types/create";

export const meta = ({ }: DsvcRoute.MetaArgs) => ({

})

export const schema = async ({ }: DsvcRoute.SchemaArgs) => z.object({
})

export default async ({ }: DsvcRoute.ActionArgs) => {
    throw new Error('not implemented')
}