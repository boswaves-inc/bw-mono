import { cn } from "../../utils";
import { Text as Primitive } from "@react-email/components";
import { ElementProps } from "./_base";
import z from "zod/v4";

export default ({  className, ...props }: ElementProps) => (
    <Primitive {...props} className={cn('text-2xl font-medium text-gray-500', className)} />
)