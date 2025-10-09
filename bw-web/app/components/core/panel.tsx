import { forwardRef, type DetailedHTMLProps, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const variants = tv({
    base: "xl:py-32 group overflow-hidden sm:px-24 sm:rounded-3xl ring-1 dark:ring-white/10 ring-gray-900/10 relative shadow-lg py-24 px-6 bg-white dark:bg-white/5",
    variants: {
        color: {
            solid: "bg-white dark:bg-white/5 [--theme:'solid']",
            gradient: "bg-white dark:bg-white/5 [--theme:'gradient']"
        }
    },
    defaultVariants: {
        color: 'gradient'
    }
})

export type PanelAttributes = HTMLAttributes<HTMLDivElement>
export interface PanelProps extends DetailedHTMLProps<PanelAttributes, HTMLDivElement> {
    color?: keyof typeof variants['variants']['color']
}

export default forwardRef<HTMLDivElement, PanelProps>(({ color, children, className, ...props }, ref) => (
    <div ref={ref} {...props} className={twMerge(variants({ color }), className)} >
        {children}
        <svg  viewBox="0 0 1024 1024" aria-hidden="true" className={twMerge("pointer-events-none blur-3xl size-[64rem] top-1/2 absolute", color !== 'gradient' && 'hidden')}>
            <circle r="512" cx="512" cy="512" className="" fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" fill-opacity="0.7"></circle>
            <defs>
                <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                    <stop stop-color="#7775D6" stopOpacity={1}></stop>
                    <stop offset="1" stop-color="#E935C1" stopOpacity={0}></stop>
                </radialGradient>
            </defs>
        </svg>
    </div>
))