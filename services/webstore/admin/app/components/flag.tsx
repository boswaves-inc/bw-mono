import { useMemo, type ComponentProps } from "react"
import { cn } from "~/utils";

export const Flag = ({ currency_code, ...props }: Omit<ComponentProps<'img'>, 'href'> & { currency_code: string }) => {
    const flag = useMemo(() => {
        const transform = currency_code.toLowerCase().substring(0, 2);

        switch (transform) {
            case 'xp': return 'nc'
            default: return transform
        }
    }, [currency_code])

    return <img {...props} src={`/currencies/${flag}.svg`} className={cn(props.className, "aspect-auto", )} />
}