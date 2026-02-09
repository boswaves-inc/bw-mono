import { Markdown as Primitive } from "@react-email/components"
import { Element } from "./+types/markdown"

export const schema = ({ builder }: Element.SchemaArgs) => builder().content(['string'])

export default ({ children, ...props }: Element.RenderArgs) => (
    <Primitive >
        {children}
    </Primitive>
)