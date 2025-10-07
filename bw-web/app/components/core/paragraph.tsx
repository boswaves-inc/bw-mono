import { forwardRef, type DetailedHTMLProps, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const variants = tv({
    base: 'dark:text-gray-400 text-gray-500',
    variants: {
        size: {
            sm: 'text-sm/6',
            base: 'text-base/7',
            lg: 'text-lg/8',
            xl: 'text-lg/8 sm:text-xl/8 font-medium'
        }
    },
    defaultVariants: {
        size: 'base'
    }
})

export type ParagraphAttributes = HTMLAttributes<HTMLParagraphElement>
export interface ParagraphProps extends DetailedHTMLProps<ParagraphAttributes, HTMLParagraphElement> {
    size?: keyof typeof variants['variants']['size']
}

export default forwardRef<HTMLParagraphElement, ParagraphProps>(({ size, color, className, ...props }, ref) => (
    <p ref={ref} {...props} className={twMerge(variants({ size }), className)} />
))