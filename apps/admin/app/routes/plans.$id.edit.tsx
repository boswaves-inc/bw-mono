import { Item, PlanScript, PeriodUnit, PlanData } from "@bw/core";
import { useForm } from "@refinedev/react-hook-form";
import _ from "lodash";
import { data, useNavigate } from "react-router";
import { Button } from "~/components/core/button";
import { Card } from "~/components/core/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/core/form";
import { Input } from "~/components/core/input";
import { Label } from "~/components/core/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/core/select";
import { Textarea } from "~/components/core/textarea";
import { EditView, EditViewHeader } from "~/components/refine/views/edit";
import type { Route } from "./+types/plans.$id.edit";
import { Flag } from "~/components/flag";
import { PricePanel } from "~/components/refine/panel/price";
import { useShow } from "@refinedev/core";

export const loader = async ({ context }: Route.LoaderArgs) => {
    const { list: currencies } = await context.chargebee.currency.list()

    return data({ currencies })
}

export default ({ loaderData }: Route.ComponentProps) => {
    const navigate = useNavigate();

    const { result: record } = useShow<PlanData>({});
    const { refineCore: { onFinish, query }, ...form } = useForm<PlanData>({
        refineCoreProps: {
            resource: 'plans'
        },
    });

    function onSubmit(values: Record<string, string>) {
        onFinish(values);
    }

    return (
        <EditView>
            <EditViewHeader resource="plan" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        name="name"
                        control={form.control}
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="Enter name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="script.uuid"
                        control={form.control}
                        rules={{ required: "Uuid is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>UUID</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="Enter script uuid"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="script.description"
                        control={form.control}
                        rules={{ required: "Description is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="Enter description"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="script.type"
                        control={form.control}
                        rules={{ required: "Type is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value || ""}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PlanScript.type.enumValues.map(value => (
                                            <SelectItem key={value} value={value}>{_.upperFirst(value)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="status"
                        control={form.control}
                        rules={{ required: "Status is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value || ""}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Item.status.enumValues.map(value => (
                                            <SelectItem value={value}>{_.upperFirst(value)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Card className="px-6">
                        <h3 className="scroll-m-20 font-semibold tracking-tight">
                            Pricing
                        </h3>
                        <div className="mt-6 grid-cols-3 sm:grid-cols-6 grid">
                            <div className="inline-grid col-span-full mb-6 grid-cols-3 sm:grid-cols-6">
                                <Label>
                                    Currency
                                </Label>
                                <Label>
                                    Frequency
                                </Label>
                                <Label className="hidden sm:block">
                                    Model
                                </Label>
                                <Label>
                                    Price
                                </Label>
                                <Label className="hidden sm:block">
                                    Cycle (soon)
                                </Label>
                                <Label className="hidden sm:block">
                                    Trial (soon)
                                </Label>
                            </div>

                            {/* {form.getValues('prices.currency_code')} */}
                            {loaderData.currencies.map(({ currency }, index) => PeriodUnit.enumValues.map(period => (
                                <div key={`${currency.id}-${period}`} className="inline-grid col-span-full py-1 border-b grid-cols-3 sm:grid-cols-6">
                                    <p className="leading-7 flex items-center gap-2 text-sm">
                                        <Flag className="h-5" currency_code={currency.currency_code} />
                                        {currency.currency_code}
                                    </p>
                                    <p className="leading-7 text-sm">
                                        {_.startCase(period)}
                                    </p>
                                    <p className="leading-7 text-sm hidden sm:block">
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    </p>
                                    <div className="leading-7 text-sm">
                                        <PricePanel
                                            index={index}
                                            currency={currency.currency_code}
                                            period={period}
                                            defaultValue={record?.prices.find(x => (
                                                x.currency_code == currency.currency_code && x.period_unit == period
                                            ))}
                                        />
                                    </div>
                                    <p className="leading-7 text-sm hidden sm:block">
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    </p>
                                    <p className="leading-7 text-sm hidden sm:block">
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    </p>
                                </div>
                            )))}
                        </div>
                        <div className="col-span-full text-muted-foreground">
                            <p className="leading-7 text-sm">
                                Showing 1 - {loaderData.currencies.length * 4} of {loaderData.currencies.length * 4}
                            </p>
                        </div>
                    </Card>
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            {...form.saveButtonProps}
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "Updating..." : "Update"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </EditView>
    );
};
