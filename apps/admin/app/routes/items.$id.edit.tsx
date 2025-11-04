import { Item } from "@bw/core";
import { useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import _ from "lodash";
import { useNavigate } from "react-router";
import { Button } from "~/components/core/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/core/form";
import { Input } from "~/components/core/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/core/select";
import { EditView, EditViewHeader } from "~/components/refine/views/edit";

export default () => {
    const navigate = useNavigate();

    const { refineCore: { onFinish, query }, ...form } = useForm({
        refineCoreProps: {},
    });

    const data = query?.data?.data;
    const { options: categoryOptions } = useSelect({
        resource: "items",
        defaultValue: data?.category,
        queryOptions: {
            enabled: !!data?.category,
        },
    });

    function onSubmit(values: Record<string, string>) {
        onFinish(values);
    }

    return (
        <EditView>
            <EditViewHeader />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="Enter title"
                                    />
                                </FormControl>
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
