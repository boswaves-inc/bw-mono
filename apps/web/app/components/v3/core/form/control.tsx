import type { ComponentProps } from "react";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Input } from "../input";
import { FormControl } from ".";
import { Checkbox } from "../checkbox";

export function InputControl<TValues extends FieldValues, TName extends Path<TValues>>({ value, onChange, ...field }: ControllerRenderProps<TValues, TName> & Omit<ComponentProps<typeof Input>, 'onChange' | 'readonly'>) {
    return (
        <FormControl>
            <Input {...field} value={value ?? undefined} onChange={e => onChange(field.type == 'number' ? e.currentTarget.valueAsNumber : e.currentTarget.value)} />
        </FormControl>
    )
}

export function CheckboxControl<TValues extends FieldValues, TName extends Path<TValues>>({ value, onChange, ...field }: ControllerRenderProps<TValues, TName> & Omit<ComponentProps<typeof Checkbox>, 'onChange' | 'onCheckedChange' | 'readonly'>) {
    return (
        <FormControl>
            <Checkbox checked={value} onCheckedChange={onChange} {...field} />
        </FormControl>
    )
}

// {/* <FormControl>
//             <Input {...field} value={value ?? undefined} onChange={e => onChange(field.type == 'number' ? e.currentTarget.valueAsNumber : e.currentTarget.value)} />
//         </FormControl> */}