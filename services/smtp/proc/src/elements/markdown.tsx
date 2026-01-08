import z from "zod/v4"
import { ElementSchema } from "./_base"
import { Markdown as Primitive } from "@react-email/components"

export default ({ content }: ElementSchema) => {
    return (
        <Primitive >
            {content}
        </Primitive>
    )
}