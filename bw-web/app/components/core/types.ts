import type { PropsWithChildren } from "react"

export type HeadlessProps<T> = Omit<T, 'className' | 'children'> & PropsWithChildren<{ className?: string }>