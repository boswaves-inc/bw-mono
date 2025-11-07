import { forwardRef } from "react"
import type { HeadlessProps } from "./types"
import { Dialog as InternalDialog, type DialogProps as InternalDialogProps, DialogPanel as InternalPanel, type DialogPanelProps as InternalPanelProps } from "@headlessui/react"
import { twMerge } from "tailwind-merge"

export const Dialog = forwardRef<HTMLElement, HeadlessProps<InternalDialogProps>>(({ children, className, ...props }, ref) => (
    <InternalDialog {...props} ref={ref} className={twMerge('', className)}>
        {children}
    </InternalDialog>
))

// export const PopoverButton = forwardRef<HTMLButtonElement, HeadlessProps<InternalButtonProps>>(({ children, className, ...props }, ref) => (
//     <InternalButton {...props} ref={ref} className={twMerge("focus:outline-none hover:cursor-pointer dark:text-gray-400 text-gray-700 text-sm/5 justify-center items-center inline-flex font-medium", className)}>
//         {children}
//     </InternalButton>
// ))

export const DialogPanel = forwardRef<HTMLElement, HeadlessProps<InternalPanelProps>>(({ children, className, transition, ...props }, ref) => (
    <InternalPanel
        {...props}
        ref={ref}
        transition={transition ?? true}
        className=""
    >
        {children}
    </InternalPanel>
))