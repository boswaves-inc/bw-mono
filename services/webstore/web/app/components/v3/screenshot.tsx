import type { ComponentProps, ComponentPropsWithoutRef } from "react"
import { cn } from "~/utils/class"

export function Screenshot({ className, ...props }: ComponentPropsWithoutRef<'img'>) {
    return (
        <div className={cn(className, 'relative [--radius:var(--radius-xl)]',)}>
            <div className="absolute -inset-(--padding) rounded-[calc(var(--radius)+var(--padding))] shadow-xs ring-1 ring-black/5 [--padding:--spacing(2)]" />
            <img {...props} className="rounded-lg object-cover object-left h-full w-full shadow-2xl ring-1 ring-black/10" />
        </div>
    )
}
