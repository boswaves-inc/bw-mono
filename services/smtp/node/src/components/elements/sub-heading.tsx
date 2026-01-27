import { cn } from "../../utils";
import { Heading as Primitive } from "@react-email/components";
import { Element } from "./+types/sub-heading";
import { z } from "zod/v4";

export const schema = ({ }: Element.SchemaArgs) => z.object({})

export default ({ children, ...props }: Element.RenderArgs) => (
    <Primitive {...props} className={cn('font-mono text-xs/5 font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400', "className")} >
        {children}
    </Primitive>
)