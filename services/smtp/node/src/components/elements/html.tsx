import z from "zod/v4"
import { ElementSchema } from "./_base"

// export const schema = z.object({
//     content: z.string(),
// })

export default ({ content }: ElementSchema) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: content }} />
    )
}