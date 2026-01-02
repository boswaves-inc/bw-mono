import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
  import countryToCurrency, { type Currencies, type Countries } from "country-to-currency";
import _ from "lodash";

export const ISO3166 = ({ code, ...props }: Omit<ComponentProps<'img'>, 'href'> & { code: Countries }) => (
    <img {...props} src={`/iso_3166/${_.lowerCase(code)}.svg`} className={twMerge(props.className, "aspect-auto",)} />
)