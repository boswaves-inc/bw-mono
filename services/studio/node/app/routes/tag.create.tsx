import { Tag } from "@boswaves-inc/webstore-core";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "~/components/core/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/core/form";
import { Input } from "~/components/core/input";
import { CreateView, CreateViewHeader } from "~/components/refine/views/create";
import _ from 'lodash';
import { type BaseSyntheticEvent, } from "react";
import type { Route } from "./+types/tag.create";

export default ({  }: Route.ComponentProps) => {
    const navigate = useNavigate();

    const { refineCore: { onFinish }, ...form } = useForm<Tag>({
        refineCoreProps: {
            resource: 'tag'
        }
    });

    const onSubmit = (values: any, event?: BaseSyntheticEvent) => {
        onFinish(values);
    }

    return (
        <CreateView>
            <CreateViewHeader resource="tag" />
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6 max-w-sm">
                    <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl className="overflow-hidden">
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