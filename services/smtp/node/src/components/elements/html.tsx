import z from "zod/v4"
import { Element } from "./+types/html"

export const schema = ({ builder }: Element.SchemaArgs) => builder(z.object({})).content(['string'])

export default ({ children, ...props }: Element.RenderArgs) => (
    <div {...props} dangerouslySetInnerHTML={{ __html: children }} />
)
