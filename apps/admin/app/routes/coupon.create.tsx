import { CouponApplication, CouponDiscount, CouponDuration, PeriodUnit } from "@boswaves/core";
import { useForm } from "@refinedev/react-hook-form";
import { data, useNavigate } from "react-router";
import { Button } from "~/components/core/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/core/form";
import { Input } from "~/components/core/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/core/select";
import { CreateView, CreateViewHeader } from "~/components/refine/views/create";
import _, { max } from 'lodash';
import { type BaseSyntheticEvent, } from "react";
import type { Route } from "./+types/plan.create";
import type { HttpError } from "@refinedev/core";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/core/alert";
import { CalendarControl } from "~/components/refine/control/calendar";
import { Separator } from "~/components/core/separator";
import { z } from "zod/v4";
import { zfd } from "zod-form-data";

type Temp = {
    name: string,

    discount_type: CouponDiscount,
    discount_amount: number | undefined,
    discount_currency: string | undefined,
    discount_percentage: number | undefined,

    apply_on: CouponApplication

    valid_from: Date | undefined,
    valid_till: Date | undefined,

    duration_type: CouponDuration,
    period: number | undefined
    period_unit: PeriodUnit | undefined

    max_redemptions: number | undefined,

}

export const loader = async ({ context: { chargebee, postgres } }: Route.LoaderArgs) => {
    const [{ list: currencies }] = await Promise.all([
        chargebee.currency.list(),
    ])

    return data({ currencies })
}

export default ({ loaderData }: Route.ComponentProps) => {
    const navigate = useNavigate();

    const { refineCore: { onFinish }, ...form } = useForm<Temp, HttpError, Temp>({
        refineCoreProps: {
            resource: 'coupon'

        }
    });

    const [apply_on, discount, duration] = form.watch(['apply_on', 'discount_type', 'duration_type'])

    const onSubmit = (values: any, event?: BaseSyntheticEvent) => {
        onFinish(values);
    }

    return (
        <CreateView>
            <CreateViewHeader resource="coupon" />
            <Form  {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="gap-y-8 grid grid-cols-2 max-w-lg gap-x-4 mt-6 ">
                    <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="Enter name"
                                        className="max-w-lg"
                                    />
                                </FormControl>
                                <FormDescription>
                                    A descriptive name for this coupon.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="apply_on"
                        control={form.control}
                        rules={{ required: "apply_on is required" }}
                        render={({ field }) => (
                            <FormItem className="max-w-lg col-span-full grid grid-cols-subgrid">
                                <FormLabel className=" col-start-1">Apply On</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl className="col-start-1">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {CouponApplication.enumValues.map(value => (
                                            <SelectItem key={value} value={value}>
                                                {_.startCase(value)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription className="col-span-full">
                                    {apply_on == 'each_specified_item' ? (
                                        "Discount will be applied to each plan and addon item specified"
                                    ) : (
                                        "Discount will be applied to the total invoice amount."
                                    )}
                                </FormDescription>
                                {apply_on == 'each_specified_item' && (
                                    <Alert variant={'info'} className="max-w-md col-span-full mt-1">
                                        <AlertCircleIcon />
                                        <AlertDescription>
                                            You can associate plans, addons and charges from the details page after creating the coupon.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </FormItem>
                        )}
                    />



                    <Separator className="col-span-full" />

                    <FormField
                        name="discount_type"
                        control={form.control}
                        rules={{ required: "discount_type is required" }}
                        render={({ field }) => (
                            <FormItem className="max-sm:col-span-full grid grid-cols-subgrid">
                                <FormLabel className=" col-start-1">Discount Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl className="col-start-1">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {CouponDiscount.enumValues.map(value => (
                                            <SelectItem key={value} value={value}>
                                                {_.startCase(value)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription className="col-span-full">
                                    {discount == 'percentage' ? (
                                        'The specified percentage will be deducted.'
                                    ) : (
                                        'The specified amount will be deducted.'
                                    )}
                                </FormDescription>
                            </FormItem>
                        )}
                    />

                    <div hidden={discount == undefined} className="max-sm:col-span-full sm:col-start-2 items-start flex max-sm:flex-wrap  gap-4">
                        {discount == 'percentage' && (
                            <FormField
                                name='discount_percentage'
                                control={form.control}
                                rules={{ required: "discount_amount is required" }}
                                render={({ field }) => (
                                    <FormItem className="max-w-lg w-full relative">
                                        <FormLabel>Amount %</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="Enter discount"
                                                type="number"
                                                step={0.01}
                                                min={0.01}
                                                max={100}
                                                className="max-w-lg"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {discount == 'fixed_amount' && (
                            <div className=" flex gap-4">
                                <FormField
                                    name="discount_currency"
                                    control={form.control}
                                    rules={{ required: "discount_currency is required" }}
                                    render={({ field }) => (
                                        <FormItem className="max-w-lg grow">
                                            <FormLabel>Currency</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl className=" grow w-full">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {loaderData.currencies.map(({ currency }) => (
                                                        <SelectItem key={currency.currency_code} value={currency.currency_code}>
                                                            {_.startCase(currency.currency_code)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name='discount_amount'
                                    control={form.control}
                                    rules={{ required: "discount_amount is required" }}
                                    render={({ field }) => (
                                        <FormItem className="max-w-lg w-full relative">
                                            <FormLabel>Amount Cents</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="Enter discount"
                                                    type="number"
                                                    min={0}
                                                    className="max-w-lg"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    <Separator className="col-span-full" />

                    <FormField
                        control={form.control}
                        name="valid_from"
                        render={({ field }) => (
                            <FormItem className=" col-start-1">
                                <FormLabel>Valid From</FormLabel>
                                <CalendarControl  {...field} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="valid_till"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valid Till</FormLabel>
                                <CalendarControl  {...field} />
                            </FormItem>
                        )}
                    />

                    <Separator className=" col-span-full" />

                    <div className=" grid grid-cols-subgrid col-span-full">

                        <FormField
                            name="duration_type"
                            control={form.control}
                            defaultValue='forever'
                            rules={{ required: "duration_type is required" }}
                            render={({ field }) => (
                                <FormItem className=" col-start-1">
                                    <FormLabel>Duration</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="sm:w-62 w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {CouponDuration.enumValues.map(value => (
                                                <SelectItem key={value} value={value}>
                                                    {_.startCase(value)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {/* <FormDescription>
                                    How long should this coupon be applied to the subscription?
                                </FormDescription> */}
                                </FormItem>
                            )}
                        />


                        <div hidden={duration !== 'limited_period'} className="max-sm:col-span-full sm:col-start-2 items-start flex max-sm:flex-wrap  gap-4">
                            <div className=" flex gap-4">
                                <FormField
                                    name="period_unit"
                                    control={form.control}
                                    rules={{ required: duration == 'limited_period' && "period_unit is required" }}
                                    render={({ field }) => (
                                        <FormItem className="max-w-lg grow">
                                            <FormLabel>Unit</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl className=" grow w-full">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PeriodUnit.enumValues.map((unit) => (
                                                        <SelectItem key={unit} value={unit}>
                                                            {_.startCase(unit)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name='period'
                                    control={form.control}
                                    rules={{ min: 1, required: duration == 'limited_period' && "period is required" }}
                                    render={({ field }) => (
                                        <FormItem className="max-w-lg relative">
                                            <FormLabel>Period</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="Enter period"
                                                    type="number"
                                                    min={1}
                                                    className="max-w-lg"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="max_redemptions"
                        render={({ field }) => (
                            <FormItem className="col-span-full">
                                <FormLabel>Maximum Redemptions</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        min={0}
                                        value={field.value || ""}
                                        placeholder="Enter limit"
                                        className="max-w-lg"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Maximum number of times this coupon can be redeemed.
                                </FormDescription>
                                <Alert variant={'info'} className="max-w-md mt-1 col-span-full">
                                    <AlertCircleIcon />
                                    <AlertTitle>
                                        Note
                                    </AlertTitle>
                                    <AlertDescription>
                                        If not specified, the coupon can be redeemed an indefinite number of times
                                    </AlertDescription>
                                </Alert>
                            </FormItem>
                        )}
                    />

                    {/* 
                    {duration == 'one_time' && (
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: "Name is required" }}
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Redemption Limit per Customer</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            value={field.value || ""}
                                            placeholder="Enter limit"
                                            className="max-w-lg"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )} */}

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