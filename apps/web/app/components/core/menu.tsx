import { forwardRef } from "react"
import { Menu, MenuButton as InternalButton, MenuItems as InternalItems, MenuItem as InternalItem } from "@headlessui/react"
import type { MenuItemsProps as InternalItemsProps, MenuButtonProps as InternalButtonProps, MenuItemProps as InternalItemProps } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'
import type { HeadlessProps } from "./types";
import { Link } from "react-router";

export { Menu };

export const MenuButton = forwardRef<HTMLButtonElement, HeadlessProps<InternalButtonProps>>(({ children, className, ...props }, ref) => {
    return (
        <InternalButton {...props} ref={ref} className={twMerge('focus:outline-none justify-center items-center text-gray-700 dark:text-gray-400 inline-flex hover:cursor-pointer touch-none font-medium text-sm', className)}>
            {children}
        </InternalButton>
    )
})
export const MenuItems = forwardRef<HTMLElement, HeadlessProps<InternalItemsProps>>(({ children, className, anchor, transition, ...props }, ref) => {
    return (
        <InternalItems {...props} ref={ref} transition={transition ?? true} anchor={anchor ?? "bottom start"} className={twMerge('py-1 focus:outline-none transition duration-200 ease-out data-closed:-translate-y-1 data-closed:opacity-0  bg-white dark:bg-gray-800 [--anchor-gap:--spacing(1)] ring-1 ring-gray-900/5 dark:ring-white/5 rounded-md', className)}>
            {children}
        </InternalItems>
    )
})
export const MenuItem = forwardRef<HTMLElement, HeadlessProps<InternalItemProps<typeof Link>>>(({ children, className, as, ...props }, ref) => {
    return (
        <InternalItem {...props} as={Link} ref={ref} >
            <div className={twMerge("block py-2 px-4 hover:bg-gray-100 hover:dark:bg-gray-800/75 text-gray-900 dark:text-white font-medium touch-none transition-colors cursor-pointer text-sm", className)}>
                {children}
            </div>
        </InternalItem>
    )
})