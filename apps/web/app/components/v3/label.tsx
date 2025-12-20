import * as Primitive from '@radix-ui/react-label'
import type { ComponentProps } from 'react'
import { cn } from '~/utils/class'

export const Label = ({ className, children, ...props }: ComponentProps<typeof Primitive.Root>) => (
    <Primitive.Root {...props} data-slot='label' className={cn('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className)}>
        {children}
    </Primitive.Root>
)