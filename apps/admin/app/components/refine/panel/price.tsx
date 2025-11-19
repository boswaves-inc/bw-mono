import { ItemPrice, PriceModel, type PeriodUnit } from "@bw/core";
import { formatCurrency } from "@coingecko/cryptoformat";
import _ from "lodash";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/core/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/core/form";
import { Input } from "~/components/core/input";
import { Panel, PanelClose, PanelContent, PanelDescription, PanelFooter, PanelHeader, PanelTitle, PanelTrigger } from "~/components/core/panel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/core/select";
import { Flag } from "~/components/flag";

export const PricePanel = ({ index, currency, period, defaultValue }: { index: number, period: PeriodUnit, currency: string, defaultValue?: ItemPrice | undefined }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [state, setState] = useState<{ price: number, pricing_model: PriceModel } | undefined>(defaultValue)

    const form = useForm<{ price: number, pricing_model: PriceModel }>({
        defaultValues: state
    });

    const onValid = (data: { price: number, pricing_model: PriceModel }) => {
        setState(data)
        setOpen(false)
    }

    const onDelete = () => {
        setState(undefined)
        form.reset()
    }

    const onOpenChange = (state: boolean) => {
        if (state == false) {
            form.reset()
        }

        setOpen(state)
    }

    return (
        <Panel open={open} onOpenChange={onOpenChange}>
            {state == undefined ? (
                <PanelTrigger asChild>
                    <Button type="button" variant={'link'} className="px-0 py-0 text-sm mr-4">
                        Set Price
                    </Button>
                </PanelTrigger >
            ) : (
                <div className="flex">
                    <FormField defaultValue={currency} name={`item_price[${index}].currency_code`} render={({ field }) => <input hidden {...field} value={currency} />} />
                    <FormField defaultValue={period} name={`item_price[${index}].period_unit`} render={({ field }) => <input hidden {...field} value={period} />} />
                    <FormField defaultValue={state.pricing_model} name={`item_price[${index}].pricing_model`} render={({ field }) => <input hidden {...field} />} />
                    <FormField defaultValue={state.price} name={`item_price[${index}].price`} render={({ field }) => <input type="number" hidden {...field} />} />

                    <PanelTrigger asChild>
                        <Button variant={'link'} size={'sm'} className="pl-0">
                            {formatCurrency(state.price / 100, currency, 'en-US', false, { decimalPlaces: 2 })}
                        </Button>
                    </PanelTrigger >
                    <PanelTrigger asChild>
                        <Button type="button" size={'sm'} className="mr-1">
                            <Pencil />
                        </Button>
                    </PanelTrigger >
                    <Button type="button" onClick={onDelete} variant={'destructive'} size={'sm'} >
                        <Trash />
                    </Button>
                </div>
            )}
            <PanelContent>
                <PanelHeader className="flex flex-row gap-4">
                    <Flag currency_code={currency} className="aspect-auto w-15 rounded-lg" />
                    <div>
                        <PanelTitle>
                            Set Price Model
                        </PanelTitle>
                        <PanelDescription>
                            Update this price model for the
                        </PanelDescription>
                    </div>
                </PanelHeader>
                <Form {...form} >
                    <form id="price" onSubmit={form.handleSubmit(onValid)} className="">
                        <div className=" space-y-4 px-4">

                            <FormField
                                control={form.control}
                                name="price"
                                rules={{ required: "Price is required" }}
                                render={({ field: { value, onChange, ...props } }) => (
                                    <FormItem>
                                        <FormLabel>Price (cents)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...props}
                                                type="number"
                                                value={value || ""}
                                                placeholder="Enter price"
                                                onChange={({ currentTarget: { value } }) => {
                                                    onChange(value)
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='pricing_model'
                                rules={{ required: "Price is required" }}
                                render={({ field: { value, onChange, ...field } }) => (
                                    <FormItem >
                                        <FormLabel>Price (cents)</FormLabel>
                                        <FormControl>
                                            <Select {...field} value={value} onValueChange={onChange} >
                                                <SelectTrigger className=" w-full">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PriceModel.enumValues.map(x => (
                                                        <SelectItem key={x} value={x}>
                                                            {_.startCase(x)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <PanelFooter>
                            <div className="flex gap-2">
                                <Button type="button" onClick={form.handleSubmit(onValid)} size={'sm'}>
                                    Save
                                </Button>
                                <PanelClose asChild>
                                    <Button type="button" variant={'outline'} size={'sm'}>
                                        Cancel
                                    </Button>
                                </PanelClose>
                            </div>
                        </PanelFooter>
                    </form >
                </Form>
            </PanelContent>
        </Panel>
    )
}