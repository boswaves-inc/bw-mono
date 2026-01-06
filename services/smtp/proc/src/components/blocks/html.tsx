import z from "zod/v4"
import { BlockSchema } from "./_base"

// export const schema = z.object({
//     content: z.string(),
// })

export default ({ content }: BlockSchema) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: content }} />
    )
}