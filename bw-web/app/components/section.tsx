import { forwardRef, type DetailedHTMLProps, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const variants = tv({
    base: 'px-4 sm:px-6 relative lg:px-8 py-24 sm:py-32 max-w-7xl mx-auto',
})

export type SectionAttributes = HTMLAttributes<HTMLElement>
export interface SectionProps extends DetailedHTMLProps<SectionAttributes, HTMLElement> {
}

export default forwardRef<HTMLElement, SectionProps>(({ className, ...props }, ref) => (
    <section ref={ref} {...props} className={twMerge(variants({}), className)} />
))