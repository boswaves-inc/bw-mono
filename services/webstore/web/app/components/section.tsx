import type { ComponentProps } from "react";
import { cn } from "~/utils/class";

export default ({ className, ...props }: ComponentProps<'section'>) => (
    <section {...props} className={cn('py-24 sm:py-32', className)} />
)
