import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const variants = tv({
    base: 'rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2',
    variants: {
        color: {
            primary: 'text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline-indigo-500',
            secundary: 'bg-indigo-50 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-white text-indigo-700 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500'
        },
        size: {
            base: 'px-3.5 py-2.5 text-sm',
            lg: 'py-3 px-8 text-base'
        }
    },
    defaultVariants: {
        color: 'primary',
        size: 'base'
    }
})


export type ButtonAttributes = ButtonHTMLAttributes<HTMLButtonElement>
export interface ButtonProps extends DetailedHTMLProps<ButtonAttributes, HTMLButtonElement> {
    color?: keyof typeof variants['variants']['color']
    size?: keyof typeof variants['variants']['size']
}

export default forwardRef<HTMLButtonElement, ButtonProps>(({ size, color, className, ...props }, ref) => (
    <button ref={ref} {...props} className={twMerge(variants({ color, size }), className)} />
))