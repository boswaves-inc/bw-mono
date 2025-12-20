import { Slot } from "@radix-ui/react-slot";
import { createElement, type ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "~/utils/class";

const headingVariant = tv({
    base: 'text-4xl font-medium tracking-tighter text-pretty text-gray-950 dark:text-white sm:text-6xl',
    variants: {
        size: {
            h1: '',
            h2: '',
            h3: '',
            h4: '',
        }
    },
    defaultVariants: {
        size: 'h1'
    }
})

const subheadingVariant = tv({
    base: 'font-mono text-xs/5 font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400',
    variants: {
        size: {
            h1: '',
            h2: '',
            h3: '',
            h4: '',
        }
    },
    defaultVariants: {
        size: 'h2'
    }
})

interface HeadingProps extends ComponentProps<'h1'>, VariantProps<typeof headingVariant> {
    asChild?: boolean;
}

export const Heading = ({ asChild, children, className, size = 'h1', ...props }: HeadingProps) => createElement(asChild ? Slot : size, {
    className: cn(headingVariant({ size }), className),
    ...props
}, children)

interface SubheadingProps extends ComponentProps<'h1'>, VariantProps<typeof subheadingVariant> {
    asChild?: boolean;
}

export const Subheading = ({ asChild, children, className, size = 'h2', ...props }: SubheadingProps) => createElement(asChild ? Slot : size, {
    className: cn('font-mono text-xs/5 font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400', className),
    ...props
}, children)


export const Lead = ({ children, className, ...props }: ComponentProps<'p'>) => createElement('p', {
    className: cn('text-2xl font-medium text-gray-500', className),
    ...props
}, children)
