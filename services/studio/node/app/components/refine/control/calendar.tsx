import { Label } from "~/components/core/label"
import { useState, type ComponentProps, type PropsWithChildren } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/core/popover"
import { Button } from "~/components/core/button"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "~/components/core/calendar"
import type { DateRange } from "react-day-picker"
import { FormControl } from "~/components/core/form"
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"


export function CalendarControl<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({ disabled, onChange, children, value, ...props }: PropsWithChildren<ControllerRenderProps<TFieldValues, TName>>) {
    return (
        <Popover >
            <FormControl>
                <input disabled={disabled} value={value} {...props} hidden />
            </FormControl>
            <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="justify-between font-normal">
                    {value ? value.toLocaleDateString() : <span className="text-muted-foreground">Select date</span>}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="overflow-hidden w-min p-0" align="start">
                <Calendar
                    mode='single'
                    selected={value}
                    onSelect={onChange}
                />
            </PopoverContent>
        </Popover>
    )
}