import type { ComponentProps } from "react";
import { cn } from "~/utils/class";

export const Input = ({ className, ...props }: ComponentProps<"input">) => {
    return (
        <input
            data-slot="input"
            className={cn(
                'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                'focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-black',
                className
            )}
            {...props}
        />
    );
}
