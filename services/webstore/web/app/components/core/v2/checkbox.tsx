import { Root, Indicator } from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import { cn } from "~/utils/class";

const variant = tv({
    base: 'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50'
})

function Checkbox({ className, ...props }: ComponentProps<typeof Root>) {
    return (
        <Root data-slot="checkbox" className={cn(variant({}), className)} {...props}>
            <Indicator data-slot="checkbox-indicator" className="flex items-center justify-center text-current transition-none">
                <CheckIcon strokeWidth={3} className="size-3" />
            </Indicator>
        </Root>
    );
}

export { Checkbox };
