import { cn } from "../../utils";
import { Text as Primitive } from "@react-email/components";
import { ElementProps } from "./_base";
import { Element } from "./+types/lead";
import { z } from "zod/v4";

export const schema = ({ }: Element.SchemaArgs) => z.object({
    content: z.string(),
})

export default ({ content,  ...props }: Element.RenderArgs) => (
    <Primitive {...props} className={cn('text-2xl font-medium text-gray-500', "className")} >
        {/* {content} */}
    </Primitive>
)