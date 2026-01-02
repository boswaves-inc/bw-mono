import { PlusIcon, XIcon } from "lucide-react"
import { createContext, useContext, type ComponentProps, type Context, type PropsWithChildren } from "react"
import { useFieldArray, useFormContext, type ControllerRenderProps, type FieldArray, type FieldArrayPath, type FieldArrayPathValue, type FieldPath, type FieldPathValue, type FieldValues, type UseFieldArrayReturn } from "react-hook-form"
import { Badge } from "~/components/core/badge"
import { Button } from "~/components/core/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/core/command"
import { FormControl, useFormField } from "~/components/core/form"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/core/popover"

type TagContext<TFieldValues extends FieldValues = FieldValues, TName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>> = {
    append: UseFieldArrayReturn<TFieldValues, TName, "key">['append']
}

const CONTEXT = createContext<TagContext>({} as any)

type TagControlProps<TFieldValues extends FieldValues, TName extends FieldArrayPath<TFieldValues>> = PropsWithChildren<Omit<ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>, 'value'>> & {
    value: FieldArrayPathValue<TFieldValues, TName>[];
};

export function TagControl<TFieldValues extends FieldValues, TName extends FieldArrayPath<TFieldValues>, TValue extends string & (FieldArray<TFieldValues, TName> | FieldArray<TFieldValues, TName>[]), TContext, TTransformedValues>({ children, disabled, name, ...field }: TagControlProps<TFieldValues, TName>) {
    const form = useFormContext<TFieldValues, TContext, TTransformedValues>()
    const array = useFieldArray<TFieldValues, TName, 'key', TTransformedValues>({
        keyName: 'key',
        control: form.control,
        name: name as TName,
    })

    return (
        <CONTEXT.Provider value={{ append: (value, options) => array.append(value as TValue, options) }}>
            <Popover >
                <FormControl>
                    <input disabled={disabled} name={name} {...field} hidden />
                </FormControl>
                <div hidden={array.fields.length == 0}>
                    {array.fields.map((tag, index) => (
                        <Badge key={index} variant={'outline'} className="text-sm gap-2">
                            {/* {tag.name} */}
                            <Button type="button" onClick={() => array.remove(index)} variant={'link'} className="p-0 px-0! h-fit">
                                <XIcon />
                            </Button>
                        </Badge>
                    ))}
                </div>
                <PopoverTrigger asChild disabled={disabled}>
                    <Button disabled={disabled} variant="outline" className="justify-start w-fit">
                        <PlusIcon />
                        Add
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Change status..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {children}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </CONTEXT.Provider>
    )
}

export const TagItem = <TFieldValues extends FieldValues, TName extends FieldArrayPath<TFieldValues>, TValue extends FieldArray<TFieldValues, TName>>({ value, onSelect, ...props }: Omit<ComponentProps<typeof CommandItem>, 'value' | 'onSelect'> & { value: TValue, onSelect?: (value: TValue) => void }) => {
    const { append } = useContext<TagContext<TFieldValues, TName>>(CONTEXT as any)

    const onSelectInt = () => {
        append(value)
        onSelect?.(value)
    }

    return (
        <CommandItem onSelect={onSelectInt} {...props} />
    )
}