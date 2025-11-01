import { RadioGroup as InternalGroup, Radio as InternalRadio, type RadioProps as InternalRadioProps, type RadioGroupProps as InternalGroupProps } from "@headlessui/react"
import { forwardRef } from "react"
import type { HeadlessProps } from "./types"
import { twMerge } from "tailwind-merge"

export const RadioGroup = forwardRef<HTMLElement, HeadlessProps<InternalGroupProps>>(({ className, children, ...props }, ref) => {
    return (
        <InternalGroup ref={ref} {...props} className={twMerge('', className)}>
            {children}
        </InternalGroup>
    )
})

export const Radio = forwardRef<HTMLElement, HeadlessProps<InternalRadioProps>>(({ className, children, ...props }, ref) => {
    return (
        <InternalRadio ref={ref} {...props} className={twMerge('', className)}>
            {children}
        </InternalRadio>
    )
})