import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default ({ className, ...props }: ComponentProps<'div'>) => (
    <div {...props} className={twMerge('px-4 sm:px-6 relative lg:px-8  max-w-7xl mx-auto', className)} />
)
