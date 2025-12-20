import type { ComponentProps } from "react";
import { cn } from "~/utils/class";

export function LogoCloud({ className }: ComponentProps<'div'>) {
    return (
        <div className={cn(className, 'flex justify-between max-sm:mx-auto max-sm:max-w-md max-sm:flex-wrap max-sm:justify-evenly max-sm:gap-x-4 max-sm:gap-y-4')}>
            <img
                alt="SavvyCal"
                src="/partners/savvycal.svg"
                className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
            />
            <img
                alt="Laravel"
                src="/partners/laravel.svg"
                className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
            />
            <img
                alt="Tuple"
                src="/partners/tuple.svg"
                className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
            />
            <img
                alt="Transistor"
                src="/partners/transistor.svg"
                className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
            />
            <img
                alt="Statamic"
                src="/partners/statamic.svg"
                className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
            />
        </div>
    )
}
