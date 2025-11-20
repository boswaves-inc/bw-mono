import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export const ISO3166 = ({ code, ...props }: Omit<ComponentProps<'img'>, 'href'> & { code: string }) => (
    <img {...props} src={`/iso_3166/${code}.svg`} className={twMerge(props.className, "aspect-auto",)} />
)