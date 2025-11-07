import { forwardRef } from "react";
import { type InputProps as InternalProps, Input as Internal } from "@headlessui/react";
import type { HeadlessProps } from "./types";
import { twMerge } from "tailwind-merge";

export interface InputProps extends HeadlessProps<InternalProps> {

}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
    <Internal ref={ref} {...props} className={twMerge("sm:text-sm/6 focus-visible:outline-indigo-400 py-2 rounded-md -outline-offset-2 ring-1 dark:ring-gray-700 outline-gray-900/10 dark:outline-white/10 focus-visible:outline-2 text-gray-900 dark:text-white select-none text-base/6 px-3 dark:bg-gray-800 bg-white w-full", className)} />
))