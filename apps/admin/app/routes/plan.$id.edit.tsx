import { Item, ItemScript, PeriodUnit, ItemPrice, PricingModel, Tag, ScriptType, Script, ItemTag, Status } from "@bw/core";
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
import type { Route } from "./+types/plan.$id.edit";
import { Flag } from "~/components/flag";
import { useShow } from "@refinedev/core";
import type { Currency } from "chargebee";
import { PricePanel } from "~/components/refine/panel/price";
import { eq } from "drizzle-orm";
import { Badge } from "~/components/core/badge";
import { TagControl, TagItem } from "~/components/refine/control/tag";

type Plan = Pick<Item, 'name' | 'description' | 'status'> & { item_price: ItemPrice[], item_tag: string[], item_script: string }

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

export default ({ loaderData: { currencies, tags, scripts }, params }: Route.ComponentProps) => {
    const navigate = useNavigate();

    const { result: record } = useShow<Item & { item_script: ItemScript, item_price: ItemPrice[], item_tag: Tag[] }>({
        resource: 'plan',
        id: params.id
    });

    const form = useForm<any, any, Plan>({
        defaultValues: {
            status: record?.status,
            item_price: record?.item_price,
            item_script: record?.item_script.uuid,
        },
        refineCoreProps: {
            id: params.id,
            resource: 'plan',
            queryOptions: {
                select: ({ data }) => ({
                    data: {
                        name: data.name,
                        slug: data.slug,
                        status: data.status,
                        item_price: data.item_price,
                        description: data.description,
                        item_script: data.item_script.uuid,
                        item_tag: data.item_tag.map((x: ItemTag) => x.slug),
                    }
                }) as any
            }
        },

    });

    function onSubmit(values: Plan) {
        form.refineCore.onFinish(values);
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
                        name="description"
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
                        name="status"
                        control={form.control}
                        disabled={record?.status === 'archived'}
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
                                        {Item.status.enumValues.filter(x => x !== 'deleted').map(value => (
                                            <SelectItem key={value} value={value}>{_.upperFirst(value)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="item_script"
                        control={form.control}
                        disabled={record?.status === 'archived'}
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
                                        {scripts.map(({ uuid, name }) => (
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
                        disabled={record?.status === 'archived'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <TagControl  {...field}>
                                    {tags.map(x => (
                                        <TagItem value={x.slug} key={x.slug}>
                                            {x.name}
                                        </TagItem>
                                    ))}
                                </TagControl>
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
                            {currencies.map(({ currency }, cidx) => PeriodUnit.enumValues.map((period_unit, pidx) => (
                                <div key={cidx * 4 + pidx} className="inline-grid col-span-full py-1 border-b grid-cols-3 sm:grid-cols-6">
                                    <p className="leading-7 flex items-center gap-2 text-sm">
                                        <Flag className="h-5" currency_code={currency.currency_code} />
                                        {currency.currency_code}
                                    </p>
                                    <p className="leading-7 text-sm">
                                        {_.startCase(period_unit)}
                                    </p>
                                    <p className="leading-7 text-sm hidden sm:block">
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    </p>
                                    <div className="leading-7 text-sm">
                                        <PricePanel currency={currency} period_unit={period_unit} />
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
                                Showing 1 - {currencies.length * 4} of {currencies.length * 4}
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