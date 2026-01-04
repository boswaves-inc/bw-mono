import { Button as Primitive } from "@react-email/components";
import { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../utils";

const variants = tv({
    base: "inline-flex justify-center gap-2 whitespace-nowrap items-center justify-center whitespace-nowrap border border-transparent",
    variants: {
        variant: {
            primary: cn(
                'px-4 py-2',
                'rounded-full bg-gray-950 shadow-md',
                'text-base font-medium text-white',
            ),
            secondary: cn(
                'relative px-4 py-2',
                'rounded-full bg-white/15 shadow-md ring-1 ring-[#D15052]/15',
                'after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_2px_1px_#ffffff4d]',
                'text-base font-medium text-gray-950',
            ),
            outline: cn(
                'px-2 py-1.5',
                'rounded-lg shadow-sm ring-1 ring-black/10',
                'text-sm font-medium text-gray-950',
            ),
        }
    },
    defaultVariants: {
        variant: 'primary'
    }
})


type ButtonProps = ComponentProps<typeof Primitive> & VariantProps<typeof variants>

export const Button = ({ variant, className, ...props }: ButtonProps) => (
    <Primitive {...props} className={cn(variants({ variant }), className)} />
)