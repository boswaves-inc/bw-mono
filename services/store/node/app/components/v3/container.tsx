import type { ComponentProps } from 'react'
import { cn } from '~/utils/class'

export function Container({ className, children, }: ComponentProps<'div'>) {
    return (
        <div className={cn('px-6 lg:px-8', className)}>
            <div className="mx-auto max-w-2xl lg:max-w-7xl">
                {children}
            </div>
        </div>
    )
}
