import { tv, VariantProps } from "tailwind-variants";
import { Heading as Primitive, Text } from "@react-email/components";
import { ComponentProps } from "react";
import { cn } from "../utils";

const hVariants = tv({
    variants: {
        size: {
            h1: 'text-4xl font-medium tracking-tighter text-pretty text-gray-950 dark:text-white',
            h2: 'mt-12 mb-10 text-2xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0',
            h3: 'mt-12 mb-10 text-xl/8 font-medium tracking-tight text-gray-950',
        }
    },
    defaultVariants: {
        size: 'h1'
    }
})

const pVariants = tv({
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


export const Heading = ({ size, className, ...props }: Omit<ComponentProps<typeof Primitive>, 'as'> & VariantProps<typeof hVariants>) => (
    <Primitive {...props} className={cn(hVariants({ size }), className)} as={size} />
)

export const Paragraph = ({ size, className, ...props }: ComponentProps<typeof Text> & VariantProps<typeof pVariants>) => (
    <Text {...props} className={cn(pVariants({ size }), 'my-10 first:mt-0 last:mb-0', className)} />
)

export const Subheading = ({ className, ...props }: ComponentProps<typeof Primitive>) => (
    <Primitive {...props} className={cn('font-mono text-xs/5 font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400', className)} as={'h2'} />
)

export const Lead = ({ className, ...props }: ComponentProps<typeof Text>) => (
    <Text {...props} className={cn('text-2xl font-medium text-gray-500', className)} />
)
