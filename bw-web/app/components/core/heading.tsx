import { createElement, forwardRef, type DetailedHTMLProps, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const variants = tv({
    base: 'text-gray-900 dark:text-white',
    variants: {
        size: {
            title: 'text-5xl font-semibold tracking-tight sm:text-7xl',
            h1: 'text-4xl font-semibold tracking-tight sm:text-5xl',
            h2: 'tracking-tight font-semibold text-4xl',
            h3: 'tracking-tight font-semibold text-2xl sm:text-3xl',
            h4: 'text-base/7 font-semibold dark:text-indigo-400 text-indigo-600',
            h5: 'text-sm/6 font-medium dark:text-white text-gray-900'
        }
    }
})

export type HeadingAttributes = HTMLAttributes<HTMLHeadingElement>
export interface HeadingProps extends DetailedHTMLProps<HeadingAttributes, HTMLHeadingElement> {
    size: keyof typeof variants['variants']['size']
}

export default forwardRef<HTMLHeadingElement, HeadingProps>(({ size, children, className, ...props }, ref) => {
    return createElement(size == 'title' ? 'h1' : size, {
        ref,
        ...props,
        className: twMerge(variants({ size }), className),
    }, children)
})