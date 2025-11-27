import { ItemPrice, PricingModel, type PeriodUnit } from "@bw/core";
import { formatCurrency } from "@coingecko/cryptoformat";
import type { Currency } from "chargebee";
import _ from "lodash";
import { Pencil, Trash } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useFieldArray, useFormContext, useForm as useReactForm, useWatch } from 'react-hook-form'
import { Button } from "~/components/core/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/core/form";
import { Input } from "~/components/core/input";
import { Panel, PanelClose, PanelContent, PanelDescription, PanelFooter, PanelHeader, PanelTitle, PanelTrigger } from "~/components/core/panel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/core/select";
import { Flag } from "~/components/flag";

export const PricePanel = ({ currency, period_unit: period }: { period_unit: PeriodUnit, currency: Currency }) => {
    const [open, setOpen] = useState<boolean>(false)

    const root = useFormContext<{
        item_price: (Pick<ItemPrice, 'period_unit' | 'period' | 'currency_code' | 'pricing_model' | 'price'> | null)[]
    }>()

    const prices = useFieldArray({
        control: root.control,
        name: `item_price`
    })

    const index = prices.fields.findIndex(({ currency_code, period_unit }) =>
        currency_code === currency.currency_code && period_unit === period
    )

    const field = useWatch({
        control: root.control,
        name: `item_price.${index}`
    })

    const form = useReactForm<Pick<ItemPrice, 'pricing_model' | 'price'>>({
        values: field ?? undefined
    });

    const onValid = (data: Pick<ItemPrice, 'pricing_model' | 'price'>) => {
        if (index >= 0) {
            prices.update(index, {
                price: data.price,
                period: 1,
                period_unit: period,
                pricing_model: data.pricing_model,
                currency_code: currency.currency_code,
            })
        }
        else {
            prices.append({
                price: data.price,
                period: 1,
                period_unit: period,
                pricing_model: data.pricing_model,
                currency_code: currency.currency_code
            })
        }

        setOpen(false)
    }

    const onDelete = () => {
        prices.remove(index)
        form.reset()
    }

    const onOpenChange = (state: boolean) => {
        if (state == false) {
            form.reset()
        }

        setOpen(state)
    }

    return (
        <Panel open={open} onOpenChange={onOpenChange} >
            {field == undefined ? (
                <PanelTrigger asChild>
                    <Button type="button" variant={'link'} className="px-0 py-0 text-sm mr-4">
                        Set Price
                    </Button>
                </PanelTrigger >
            ) : (
                <div className="flex">
                    <Fragment>
                        <FormField name={`item_price.${index}.id`} render={({ field }) => <input hidden {...field} />} />
                        <FormField name={`item_price.${index}.period`} render={({ field }) => <input type="number" hidden {...field} />} />
                        <FormField name={`item_price.${index}.period_unit`} render={({ field }) => <input hidden {...field} value={period} />} />
                        <FormField name={`item_price.${index}.currency_code`} render={({ field }) => <input hidden {...field} value={currency.currency_code} />} />
                        <FormField defaultValue={field.price} name={`item_price.${index}.price`} render={({ field: props }) => <input type="number" hidden {...props} value={field.price as number} />} />
                        <FormField defaultValue={field.pricing_model} name={`item_price.${index}.pricing_model`} render={({ field }) => <input hidden {...field} />} />
                    </Fragment>

                    <PanelTrigger asChild>
                        <Button variant={'link'} size={'sm'} className="pl-0">
                            {formatCurrency(field.price / 100, currency.currency_code, 'en-US', false, { decimalPlaces: 2 })}
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
                    <Flag currency_code={currency.currency_code} className="aspect-auto w-15 rounded-lg" />
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
                    <form onSubmit={form.handleSubmit(onValid)} className="">
                        <div className=" space-y-4 px-4">
                            <FormField
                                control={form.control}
                                name={`price`}
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
                                name={`pricing_model`}
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
                                                    {PricingModel.enumValues.map(x => (
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
                                <Button onClick={form.handleSubmit(onValid)} size={'sm'}>
                                    Save
                                </Button>
                                <PanelClose asChild>
                                    <Button type="button" variant={'outline'} size={'sm'}>
                                        Cancel
                                    </Button>
                                </PanelClose>
                            </div>
                        </PanelFooter>
                    </form>
                </Form>
            </PanelContent>
        </Panel>
    )
}   