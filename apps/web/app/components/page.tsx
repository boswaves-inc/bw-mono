import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default ({ className, ...props }: ComponentProps<'section'>) => (
    <section {...props} className={twMerge('px-4 sm:px-6 relative lg:px-8 py-24 sm:py-32 max-w-7xl mx-auto', className)} />
)
