import { cn } from "../../utils";
import { Text as Primitive } from "@react-email/components";
import { ElementProps } from "./_base";

export default ({ content, className, ...props }: ElementProps) => (
    <Primitive {...props} className={cn('text-2xl font-medium text-gray-500', className)} >
        {content}
    </Primitive>
)