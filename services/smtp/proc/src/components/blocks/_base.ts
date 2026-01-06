import z, { ZodType } from "zod/v4";

export type BlockSchema<T extends ZodType | undefined = undefined> = (T extends undefined ? {} : T extends ZodType ? z.output<T> : {}) & {
    content: any
}

export type BlockProps<T extends ZodType | undefined = undefined> = ComponentProps & BlockSchema<T>

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