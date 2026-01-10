import { cn } from "../../utils";
import { Heading as Primitive } from "@react-email/components";
import { ElementProps } from "./_base";

export default ({  className, ...props }: ElementProps) => (
    <Primitive {...props} className={cn('font-mono text-xs/5 font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400', className)} />
)