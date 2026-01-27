import z from "zod/v4"
import { Markdown as Primitive } from "@react-email/components"
import { Element } from "./+types/markdown"

export const schema = ({ builder }: Element.SchemaArgs) => builder(
    z.object({})
).content(['string'])

export default ({ children, ...props }: Element.RenderArgs) => (
    <Primitive >
        {children}
    </Primitive>
)