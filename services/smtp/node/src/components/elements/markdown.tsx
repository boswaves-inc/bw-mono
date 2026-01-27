import z from "zod/v4"
import { Markdown as Primitive } from "@react-email/components"
import { element } from "./_utils"
import { Element } from "./+types/markdown"

export const schema = ({ }: Element.SchemaArgs) => z.object({
    content: z.string()
})

export default ({ content, ...props }: Element.RenderArgs) => (
    <Primitive >
        s
        {/* {content} */}
    </Primitive>
)