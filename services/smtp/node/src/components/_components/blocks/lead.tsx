import { cn } from "../utils";
import { Text as Primitive } from "@react-email/components";
import { BlockProps } from "./_base";
import z from "zod/v4";

export default ({  className, ...props }: BlockProps) => (
    <Primitive {...props} className={cn('text-2xl font-medium text-gray-500', className)} />
)