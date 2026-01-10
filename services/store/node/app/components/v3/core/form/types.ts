
import type { ComponentProps } from "react"
import type { FieldPath, FieldValues, SubmitErrorHandler, SubmitHandler, UseFormReturn } from "react-hook-form"
import type { HTMLFormMethod } from "react-router"
import { z } from "zod/v4"

export type FormContext = {
    submit: (e: HTMLElement | null) => void
    reset: () => void
    dirty: boolean
}

export type FormFieldContext<TValues extends FieldValues = FieldValues, TName extends FieldPath<TValues> = FieldPath<TValues>> = {
    name: TName
    readonly: boolean | undefined
}

export type FormItemContext = {
    id: string
}

export interface FormProps<TFieldValues extends FieldValues, TContext, TTransformedValues> extends Omit<ComponentProps<'form'>, 'onSubmit' | 'onInvalid' | 'method' | 'encType' | 'action'> {
    action?: string,
    method?: HTMLFormMethod,
    control: UseFormReturn<TFieldValues, TContext, TTransformedValues>,
    encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain" | undefined
    onValid?: SubmitHandler<TTransformedValues>,
    onInvalid?: SubmitErrorHandler<TFieldValues>
    onSuccess?: () => void
    onError?: () => void
}

export const FormResult = z.union([
    z.object({
        error: z.string(),
    }),
    z.object({
        success: z.literal(true),
    }),
])

export type FormResult = z.output<typeof FormResult>