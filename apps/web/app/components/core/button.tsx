// import type { ButtonHTMLAttributes, ComponentProps, DetailedHTMLProps } from "react";
// import { createElement, forwardRef } from "react";
// import { Slot } from '@radix-ui/react-slot'
// import { twMerge } from "tailwind-merge";
// import { tv, type VariantProps } from "tailwind-variants";

// const variants = tv({
//     base: " inline-flex items-center gap-2 justify-center rounded-md text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
//     variants: {
//         variant: {
//             primary: 'text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline-indigo-500',
//             secundary: 'bg-indigo-50 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-white text-indigo-700 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500'
//         },
//         size: {
//             default: 'px-4 py-2.5 text-sm has-[>svg]:px-3',
//             sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
//             lg: 'h-10 px-8 px-6 has-[>svg]:px-4',
//             icon: 'size-9'
//         }
//     },
//     defaultVariants: {
//         variant: 'primary',
//         size: 'default'
//     }
// })


// export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof variants> {
//     asChild?: boolean
// }

// export default ({ asChild, className, children, ...props }: ButtonProps) => createElement(asChild ? Slot : 'button', {
//     "data-slot": 'button',
//     className: twMerge(
//         variants(props),
//         className
//     ),
//     ...props,
// } as any, children)