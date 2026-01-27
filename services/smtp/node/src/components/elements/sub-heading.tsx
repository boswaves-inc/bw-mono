import { cn } from "../../utils";
import { Heading as Primitive } from "@react-email/components";
import { Element } from "./+types/sub-heading";
import { z } from "zod/v4";

export const schema = ({ }: Element.SchemaArgs) => z.object({
    content: z.string(),
})

export default ({ content, ...props }: Element.RenderArgs) => (
    <Primitive {...props} className={cn('font-mono text-xs/5 font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400', "className")} >
        {/* {content} */}
    </Primitive>
)