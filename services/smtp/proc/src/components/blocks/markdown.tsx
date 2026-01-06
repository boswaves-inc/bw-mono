import z from "zod/v4"
import { BlockSchema } from "./_base"
import { Markdown as Primitive } from "@react-email/components"

export default ({ content }: BlockSchema) => {
    return (
        <Primitive >
            {content}
        </Primitive>
    )
}