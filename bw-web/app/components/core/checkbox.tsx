import { forwardRef } from "react";
import { Checkbox as Internal } from "@headlessui/react";
import type { CheckboxProps as InternalProps } from "@headlessui/react";
import type { HeadlessProps } from "./types";
import { twMerge } from "tailwind-merge";
import { CheckIcon } from "lucide-react";

export const Checkbox = forwardRef<HTMLElement, HeadlessProps<InternalProps>>(({ children, className, ...props }, ref) => (
    <Internal {...props} ref={ref} className={twMerge('group p-0.25 size-4 rounded-sm relative border border-gray-300 dark:border-gray-700 focus:not-data-focus:outline-none dark:data-checked:bg-indigo-400 data-checked:bg-indigo-500 data-focus:outline data-focus:outline-offset-2 dark:data-focus:outline-indigo-400 data-focus:outline-indigo-600', className)} >
      <CheckIcon strokeWidth={3} className="hidden size-3 text-white group-data-checked:block"/>
    </Internal>
))