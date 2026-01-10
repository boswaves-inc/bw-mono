import { forwardRef } from "react";
import { TabGroup as InternalGroup, TabList as InternalList, TabPanels as InternalPanels, TabPanel as InternalPanel, Tab as Internal } from "@headlessui/react";
import type { TabGroupProps as InternalGroupProps, TabPanelProps as InternalPanelProps, TabProps as InternalProps, TabListProps as InternalListProps, TabPanelsProps as InternalPanelsProps } from "@headlessui/react";
import type { HeadlessProps } from "./types";
import { twMerge } from "tailwind-merge";

interface TabGroupProps extends HeadlessProps<InternalGroupProps> {

}

export const TabGroup = forwardRef<HTMLElement, TabGroupProps>(({ className, ...props }, ref) => (
    <InternalGroup {...props} ref={ref} className={twMerge(className)} />
))

interface TabListProps extends HeadlessProps<InternalListProps> {

}

export const TabList = forwardRef<HTMLElement, TabListProps>(({ className, ...props }, ref) => (
    <InternalList {...props} ref={ref} className={twMerge('border-b dark:border-white/10 border-gray-900 flex -mb-px', className)} />
))

interface TabPanelsProps extends HeadlessProps<InternalPanelsProps> {

}

export const TabPanels = forwardRef<HTMLElement, TabPanelsProps>(({ className, ...props }, ref) => (
    <InternalPanels {...props} ref={ref} className={twMerge(className)} />
))

interface TabProps extends HeadlessProps<InternalProps> {

}

export const Tab = forwardRef<HTMLElement, TabProps>(({ className, ...props }, ref) => (
    <Internal {...props} ref={ref} className={twMerge('focus:outline-none border-b-2 py-6 dark:hover:border-gray-100 dark:text-gray-400 dark:hover:text-gray-100 hover:border-gray-300 hover:text-gray-800 text-gray-700 not-last:mr-8 border-transparent dark:aria-selected:text-indigo-400 dark:aria-selected:border-indigo-400 aria-selected:text-indigo-600 aria-selected:border-indigo-600 whitespace-nowrap font-medium text-sm/5', className)} />
))

interface TabPanelProps extends HeadlessProps<InternalPanelProps> {

}

export const TabPanel = forwardRef<HTMLElement, TabPanelProps>(({ className, ...props }, ref) => (
    <InternalPanel {...props} ref={ref} className={twMerge('focus:outline-none ', className)} />
))