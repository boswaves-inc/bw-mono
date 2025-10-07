import { forwardRef, type DetailedHTMLProps, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const variants = tv({
    base: 'text-gray-900 dark:text-white whitespace-nowrap font-medium text-sm/5/tight pr-6 cursor-default',
})

export type LabelAttributes = HTMLAttributes<HTMLLabelElement>
export interface LabelProps extends DetailedHTMLProps<LabelAttributes, HTMLLabelElement> {
}

export default forwardRef<HTMLLabelElement, LabelProps>(({ color, className, ...props }, ref) => (
    <label ref={ref} {...props} className={twMerge(variants({}), className)} />
))