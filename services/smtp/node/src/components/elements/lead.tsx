import { cn } from "../../utils";
import { Text as Primitive } from "@react-email/components";
import { Element } from "./+types/lead";

export const schema = ({ builder }: Element.SchemaArgs) => builder().content()

export default ({ children, ...props }: Element.RenderArgs) => (
    <Primitive {...props} className={cn('text-2xl font-medium text-gray-500', "className")} >
        {children}
    </Primitive>
)