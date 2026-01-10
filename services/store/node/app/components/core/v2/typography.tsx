import { createElement, type ComponentProps } from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "~/utils/class"

const headerVariant = tv({
    variants: {
        size: {
            title: 'text-5xl font-semibold tracking-tight text-balance sm:text-7xl',
            h1: 'sroll-m-20 text-4xl font-semibold tracking-tight text-balance sm:text-5xl',
            h2: 'sroll-m-20 tracking-tight font-semibold text-4xl',
            h3: 'sroll-m-20 tracking-tight font-semibold text-2xl sm:text-3xl',
            h4: 'sroll-m-20 text-base/7 font-semibold dark:text-indigo-400 text-indigo-600',
            h5: 'sroll-m-20 text-sm/6 font-medium dark:text-white text-gray-900'
        }
    },
    defaultVariants: {
        size: 'h1'
    }
})

const paragraphVariant = tv({
    variants: {
        variant: {
            default: 'text-foreground',
            label: 'font-semibold text-foreground',
            muted: 'text-muted-foreground',
        },
        size: {
            sm: 'text-sm/6 leading-none font-medium',
            lg: 'text-lg/8 font-semibold',
            default: 'text-base/6',
            muted: 'font-medium text-sm/6',
        },
    },
    defaultVariants: {
        size: 'default',
        variant: 'default'
    }
})

export const Heading = ({ children, className, size = 'h1', ...props }: ComponentProps<'h1'> & VariantProps<typeof headerVariant>) => createElement(size, {
    className: cn(headerVariant({ size }), className),
    ...props
}, children)

export const Paragraph = ({ variant = 'default', size = 'default', children, className, ...props }: ComponentProps<'p'> & VariantProps<typeof paragraphVariant>) => createElement('p', {
    className: cn(paragraphVariant({ variant, size }), className),
    ...props
}, children)

export const InlineCode = ({ children, className, ...props }: ComponentProps<'code'>) => createElement('code', {
    className: cn('bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className),
    ...props
}, children)

export const Blockquote = ({ children, className, ...props }: ComponentProps<'p'>) => createElement('blockquote', {
    className: cn('mt-6 border-l-2 pl-6 italic', className),
    ...props
}, children)

export const Lead = ({ children, className, ...props }: ComponentProps<'p'>) => createElement('div', {
    className: cn('text-muted-foreground text-xl', className),
    ...props
}, children)

export const List = ({ children, className, ...props }: ComponentProps<'ul'>) => createElement('ul', {
    className: cn('my-6 ml-6 list-disc [&>li]:mt-2', className),
    ...props
}, children)