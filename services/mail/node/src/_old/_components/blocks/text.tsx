import { cn } from "../utils";
import { Text as Primitive } from "@react-email/components";
import { BlockProps } from "./_base";
import { tv } from "tailwind-variants";
import z from "zod/v4";

const variants = tv({
    variants: {
        size: {
            default: 'text-base/8',
            lg: 'text-lg/8',
        }
    },
    defaultVariants: {
        size: 'default'
    }
})


export const schema = z.object({
    size: z.enum<readonly (keyof typeof variants.variants.size)[]>([
        'default',
        'lg',
    ]).optional(),
})

export default ({ size, className, ...props }: BlockProps<typeof schema>) => (
    <Primitive {...props} className={cn(variants({ size }), 'my-10 first:mt-0 last:mb-0', className)} />
)