// import { Textarea } from "@/components/ui/textarea";
import { Item, ItemScript, Period, Status } from "@bw/core";
import { useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { data, Link, useNavigate } from "react-router";
import { Button } from "~/components/core/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/core/form";
import { Input } from "~/components/core/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/core/select";
import { Textarea } from "~/components/core/textarea";
import { CreateView, CreateViewHeader } from "~/components/refine/views/create";
import _ from 'lodash';
import { type BaseSyntheticEvent, } from "react";
import type { Route } from "./+types/scripts.create";
import { Card } from "~/components/core/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/core/sheet";
import { Label } from "~/components/core/label";

export const loader = async ({ context }: Route.LoaderArgs) => {
    const { list: currencies } = await context.chargebee.currency.list()

    return data({ currencies })
}

export default ({ loaderData }: Route.ComponentProps) => {
    const navigate = useNavigate();

    const { refineCore: { onFinish }, ...form } = useForm({
        refineCoreProps: {
            createMutationOptions: {
                meta: {
                    "Content-Type": 'test'
                }
            }
        }
    });

    const onSubmit = (values: any, event?: BaseSyntheticEvent) => {
        onFinish(values);
    }

    return (
        <CreateView>
            <CreateViewHeader resource="scripts" />
            <Form  {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
                    <FormField
                        control={form.control}
                        name="name"
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
                        control={form.control}
                        name="uuid"
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
                        control={form.control}
                        name="description"
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
                        control={form.control}
                        name="type"
                        rules={{ required: "Type is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {ItemScript.type.enumValues.map(value => (
                                            <SelectItem value={value}>{_.upperFirst(value)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        rules={{ required: "Status is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange}>
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
                        <div className="mt-6 grid-cols-6 grid">
                            <div className="inline-grid col-span-full mb-6 grid-cols-6">
                                <Label>
                                    Currency
                                </Label>
                                <Label>
                                    Frequency
                                </Label>
                                <Label>
                                    Pricing Model
                                </Label>
                                <Label>
                                    Price
                                </Label>
                                <Label>
                                    Cycle
                                </Label>
                                <Label>
                                    Trial
                                </Label>
                            </div>
                            {loaderData.currencies.map(({ currency }) => Period.enumValues.map(period => (
                                <div className="inline-grid col-span-full py-1 border-b grid-cols-6">
                                    <p className="leading-7 text-sm">
                                        {currency.currency_code}
                                    </p>
                                    <p className="leading-7 text-sm">
                                        {_.startCase(period)}
                                    </p>
                                    <p className="leading-7 text-sm">
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    </p>
                                    <p className="leading-7 text-sm">
                                        <Link to="" className="text-accent-foreground">
                                            Set Price
                                        </Link>
                                    </p>
                                    <p className="leading-7 text-sm">
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    </p>
                                    <p className="leading-7 text-sm">
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
                        <Button type="submit" {...form.saveButtonProps} disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Creating..." : "Create"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </CreateView>
    );
};
