import { Popover as InternalPopover, PopoverButton as InternalButton, PopoverPanel as InternalPanel } from "@headlessui/react";
import type { PopoverProps as InternalPoverProps, PopoverButtonProps as InternalButtonProps, PopoverPanelProps as InternalPanelProps } from "@headlessui/react";
import { forwardRef } from "react";
import type { HeadlessProps } from "./types";
import { twMerge } from "tailwind-merge";

export const Popover = forwardRef<HTMLElement, HeadlessProps<InternalPoverProps>>(({ children, className, ...props }, ref) => (
    <InternalPopover {...props} ref={ref} className={twMerge('items-baseline', className)}>
        {children}
    </InternalPopover>
))

export const PopoverButton = forwardRef<HTMLButtonElement, HeadlessProps<InternalButtonProps>>(({ children, className, ...props }, ref) => (
    <InternalButton {...props} ref={ref} className={twMerge("focus:outline-none hover:cursor-pointer text-gray-700 text-sm/5 justify-center items-center inline-flex font-medium", className)}>
        {children}
    </InternalButton>
))

export const PopoverPanel = forwardRef<HTMLElement, HeadlessProps<InternalPanelProps>>(({ children, className, transition, anchor, ...props }, ref) => (
    <InternalPanel
        {...props}
        ref={ref}
        transition={transition ?? true}
        anchor={anchor ?? "bottom end"}
        className="[--anchor-gap:--spacing(1)] ring-1 ring-gray-900/5 p-4 transition rounded-md shadow-xl duration-200 data-closed:-translate-y-1 data-closed:opacity-0 block bg-white"
    >
        {children}
    </InternalPanel>
))