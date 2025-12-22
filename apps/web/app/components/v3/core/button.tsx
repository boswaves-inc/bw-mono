import { Slot } from "@radix-ui/react-slot";
import { createElement, type ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "~/utils/class";

const variants = tv({
    base: "inline-flex items-center justify-center [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4  whitespace-nowrap border border-transparent",
    variants: {
        variant: {
            primary: cn(
                'px-4 py-[calc(--spacing(2)-1px)]',
                'rounded-full bg-gray-950 shadow-md',
                'text-base font-medium text-white',
                'data-disabled:bg-gray-950 data-disabled:opacity-40 data-hover:bg-gray-800',
            ),
            secondary: cn(
                'relative px-4 py-[calc(--spacing(2)-1px)]',
                'rounded-full bg-white/15 shadow-md ring-1 ring-[#D15052]/15',
                'after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_2px_1px_#ffffff4d]',
                'text-base font-medium text-gray-950',
                'data-disabled:bg-white/15 data-disabled:opacity-40 data-hover:bg-white/20',
            ),
            outline: cn(
                'px-2 py-[calc(--spacing(1.5)-1px)]',
                'rounded-lg shadow-sm ring-1 ring-black/10',
                'text-sm font-medium text-gray-950',
                'data-disabled:bg-transparent data-disabled:opacity-40 data-hover:bg-gray-50',
            ),
        }
    },
    defaultVariants: {
        variant: 'primary'
    }
})

interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof variants> {
    asChild?: boolean;
}

export const Button = ({ children, className, variant, asChild = false, ...props }: ButtonProps) => createElement(asChild ? Slot : 'button', {
    className: cn(variants({ variant, className })),
    'data-slot': 'button',
    ...props
} as any, children)
