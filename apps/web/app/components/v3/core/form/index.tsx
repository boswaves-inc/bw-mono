import { createContext, useContext, type ComponentProps, useId, type BaseSyntheticEvent } from 'react';
import { Controller, type ControllerProps, type FieldErrors, type FieldPath, type FieldValues, FormProvider, useFormContext, useFormState } from 'react-hook-form'
import { Slot } from '@radix-ui/react-slot';
import { useFetcher } from 'react-router';
import type { FormContext, FormFieldContext, FormItemContext, FormProps } from './types';
import { flattenObject } from '~/utils/object';
import { cn } from '~/utils/class';
import { Label } from '../label';

const FORM_CONTEXT = createContext({} as FormContext)
const FIELD_CONTEXT = createContext({} as FormFieldContext)
const ITEM_CONTEXT = createContext({} as FormItemContext)

const useFormField = () => {
    const { id } = useContext(ITEM_CONTEXT)
    const { getFieldState } = useFormContext()

    const fieldContext = useContext(FIELD_CONTEXT)

    const formState = useFormState({ name: fieldContext.name })
    const fieldState = getFieldState(fieldContext.name, formState)

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>')
    }

    return {
        id,
        name: fieldContext.name,
        readOnly: fieldContext.readonly,
        formItemId: `${id}-form-item`,
        formMessageId: `${id}-form-item-message`,
        formDescripionId: `${id}-form-item-description`,
        ...fieldState
    }
}

export const Form = <TFieldValues extends FieldValues = FieldValues, TContext = any>({ onSuccess, onError, onValid, onInvalid, method, encType = "application/x-www-form-urlencoded", action, control, children, ...props }: FormProps<TFieldValues, TContext, TFieldValues>) => {
    const fetcher = useFetcher()

    const reset = () => control.reset()
    const submit = () => control.handleSubmit(onValidInt, onInvalidInt)()

    const dirty = control.formState.isDirty

    const onValidInt = async (data: TFieldValues, e?: BaseSyntheticEvent<object, any, any> | undefined) => {
        onValid?.(data, e)

        try {
            await fetcher.submit(flattenObject(data), {
                method,
                action,
                encType
            })

            e?.preventDefault()
            e?.stopPropagation()

            onSuccess?.()
        }
        catch (error) {
            e?.preventDefault()
            e?.stopPropagation()

            onError?.();
        }
    }

    const onInvalidInt = (errors: FieldErrors<TFieldValues>, event?: React.BaseSyntheticEvent) => {
        onInvalid?.(errors, event)
    }

    return (
        <FormProvider {...control}>
            <FORM_CONTEXT value={{ submit, reset, dirty }}>
                <form {...props} method={method} encType={encType} action={action} onSubmit={control.handleSubmit(onValidInt, onInvalidInt)}>
                    {children}
                </form>
            </FORM_CONTEXT>
        </FormProvider>
    )
};

export const FormField = <TValues extends FieldValues = FieldValues, TName extends FieldPath<TValues> = FieldPath<TValues>>(props: ControllerProps<TValues, TName> & { readOnly?: boolean | undefined }) => {
    return (
        <FIELD_CONTEXT value={{ name: props.name, readonly: props.readOnly }}>
            <Controller {...props} />
        </FIELD_CONTEXT>
    )
}

export const FormItem = ({ className, ...props }: ComponentProps<'div'>) => {
    const id = useId()

    return (
        <ITEM_CONTEXT.Provider value={{ id }}>
            <div data-slot="form-item" className={cn('grid gap-1', className)} {...props} />
        </ITEM_CONTEXT.Provider>
    )
}

export const FormLabel = ({ className, ...props }: ComponentProps<typeof Label>) => {
    const { error, formItemId } = useFormField()

    return (
        <Label
            data-slot="form-label"
            data-error={!!error}
            htmlFor={formItemId}
            className={cn('data-[error=true]:text-destructive text-nowrap', className)}
            {...props}
        />
    )
}

export const FormControl = ({ ...props }: ComponentProps<typeof Slot>) => {
    const { error, formItemId, formDescripionId, formMessageId, readOnly, ...field } = useFormField()

    return (
        <Slot
            {...props}
            {...{ readOnly: readOnly }}
            id={formItemId}
            data-slot="form-control"
            aria-invalid={!!error}
            aria-readonly={!!readOnly}
            aria-describedby={
                !error
                    ? `${formDescripionId}`
                    : `${formDescripionId} ${formMessageId}`
            }
        />
    )
}

export const FormDescripion = ({ className, ...props }: ComponentProps<'p'>) => {
    const { formDescripionId } = useFormField()

    return (
        <p
            {...props}
            data-slot='form-description'
            id={formDescripionId}
            className={cn('text-muted-foreground text-sm', className)}
        />
    )
}

export const FromMessage = ({ className, ...props }: ComponentProps<'p'>) => {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error?.message ?? '') : props.children

    if (!body) {
        return null
    }

    return (
        <p data-slot='form-message' id={formMessageId} className={cn('text-destructive text-sm', className)} {...props}>
            {body}
        </p>
    )
}