import z from "zod/v4"
import { Element } from "./+types/html"

export const schema = ({ }: Element.SchemaArgs) => z.object({
    content: z.string(),
})

export default ({ content, ...props }: Element.RenderArgs) => (
    <div {...props} dangerouslySetInnerHTML={{ __html: content }} />
)
