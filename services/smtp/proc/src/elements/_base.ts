import z, { ZodObject } from "zod/v4";

export interface ElementType {
    key: string,
    path: string
}

export interface ElementModule {
    schema: ZodObject | undefined
    // default: RouteHandler,
}

export interface ElementMap {
    [topic: string]: ElementModule,
}

export type ElementSchema<T extends ZodObject | undefined = undefined> = (T extends undefined ? {} : T extends ZodObject ? z.output<T> : {}) & {
    content: any
}

export type ElementProps<T extends ZodObject | undefined = undefined> = ComponentProps & ElementSchema<T>

export type ComponentProps = {
    className?: string
}

export const href = z.object({
    href: z.string().optional(),
    target: z.enum([
        "_self",
        "_blank",
        "_parent",
        "_top",
    ]).optional()
})