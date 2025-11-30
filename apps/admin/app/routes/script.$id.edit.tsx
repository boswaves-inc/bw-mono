import {  Script } from "@bw/core";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "~/components/core/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/core/form";
import { Input } from "~/components/core/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/core/select";
import _ from 'lodash';
import { type BaseSyntheticEvent, } from "react";
import type { Route } from "./+types/script.$id.edit";
import { useShow } from "@refinedev/core";
import { EditView, EditViewHeader } from "~/components/refine/views/edit";

export default ({ params }: Route.ComponentProps) => {
    const navigate = useNavigate();

    const { result: record } = useShow<Script>({
        resource: 'script',
        id: params.id
    });

    const { refineCore: { onFinish }, ...form } = useForm<Script>({
        defaultValues: record,
        refineCoreProps: {
            resource: 'script',
            id: params.id
        }
    });

    const onSubmit = (values: any, event?: BaseSyntheticEvent) => {
        onFinish(values);
    }

    return (
        <EditView>
            <EditViewHeader resource="script" />
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
                    <FormField
                        name="type"
                        control={form.control}
                        rules={{ required: "Type is required" }}
                        render={({ field }) => (
                            <FormItem className="max-w-sm">
                                <FormLabel>Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Script.type.enumValues.map(value => (
                                            <SelectItem key={value} value={value}>{_.upperFirst(value)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                            <FormItem className=" max-w-sm">
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
                    <div className="flex gap-2 pb-6">
                        <Button type="button" {...form.saveButtonProps} disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Updating..." : "Update"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </EditView>
    );
};