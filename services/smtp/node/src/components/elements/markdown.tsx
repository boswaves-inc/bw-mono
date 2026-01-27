import z from "zod/v4"
import { Markdown as Primitive } from "@react-email/components"
import { Element } from "./+types/markdown"

export const schema = ({ }: Element.SchemaArgs) => z.object({
    content: z.string()
})

export default ({ children, ...props }: Element.RenderArgs) => (
    <Primitive >
        {children as string}
    </Primitive>
)