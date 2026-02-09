import { PeriodUnit, Script, Tag } from "@boswaves-inc/webstore-core";
import { useForm } from "@refinedev/react-hook-form";
import { data, useNavigate } from "react-router";
import { Button } from "~/components/core/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/core/form";
import { Input } from "~/components/core/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/core/select";
import { Textarea } from "~/components/core/textarea";
import { CreateView, CreateViewHeader } from "~/components/refine/views/create";
import _ from 'lodash';
import { type BaseSyntheticEvent, } from "react";
import type { Route } from "./+types/plan.create";
import { Card } from "~/components/core/card";
import { Label } from "~/components/core/label";
import { Flag } from "~/components/flag";
import { PricePanel } from "~/components/refine/panel/price";
import type { Currency } from "chargebee";
import { eq } from "drizzle-orm";
import { TagControl, TagItem } from "~/components/refine/control/tag";

export const loader = async ({ context: { chargebee, postgres } }: Route.LoaderArgs) => {
    const [{ list: currencies }, tags, scripts] = await Promise.all([
        chargebee.currency.list(),
        postgres.select().from(Tag).where(
            eq(Tag.status, 'active')
        ),
        postgres.select().from(Script).where(
            eq(Script.status, 'active')
        )
    ])

    return data({ currencies, tags, scripts })
}

export default ({ loaderData }: Route.ComponentProps) => {
    const navigate = useNavigate();

    const { refineCore: { onFinish }, ...form } = useForm<{ name: string, description: string, type: string, }>({
        refineCoreProps: {
            resource: 'plan'
        }
    });

    const onSubmit = (values: any, event?: BaseSyntheticEvent) => {
        onFinish(values);
    }

    return (
        <CreateView>
            <CreateViewHeader resource="plan" />
            <Form  {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6 ">
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
                                        className="max-w-sm"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="item_script"
                        control={form.control}
                        rules={{ required: "item_script is required" }}
                        render={({ field }) => (
                            <FormItem className="max-w-sm">
                                <FormLabel>Script</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select script" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {loaderData.scripts.map(({ uuid, name }) => (
                                            <SelectItem key={uuid} value={uuid}>{name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="item_tag"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <TagControl {...field}>
                                    {loaderData.tags.map(x => (
                                        <TagItem value={x.slug} key={x.slug}>
                                            {x.name}
                                        </TagItem>
                                    ))}
                                </TagControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="excerpt"
                        rules={{ required: "Excerpt is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Excerpt</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="Enter excerpt"
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
                                    Cycle
                                </Label>
                                <Label className="hidden sm:block">
                                    Trial
                                </Label>
                            </div>
                            {loaderData.currencies.map(({ currency }) => PeriodUnit.enumValues.map((period) => (
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
                                        <PricePanel currency={currency} period_unit={period} />
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

                    <div className="flex gap-2 pb-6">
                        <Button type="button" {...form.saveButtonProps} disabled={form.formState.isSubmitting}>
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