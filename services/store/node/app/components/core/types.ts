import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react"

export type HeadlessProps<T> = Omit<T, 'className' | 'children'> & PropsWithChildren<{ className?: string }>

export type DivAttr = HTMLAttributes<HTMLDivElement>
export type DivProps = DetailedHTMLProps<DivAttr, HTMLDivElement>