import {  User } from "@bw/core";
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

    const { refineCore: { onFinish, query }, ...form } = useForm<User>({
        refineCoreProps: {},
    });

    // const { options: categoryOptions } = useSelect<User>({
    //     resource: "users",
    //     defaultValue: data?.uid,
    //     queryOptions: {
    //         enabled: !!data?.uid,
    //     },
    // });

    function onSubmit(values: Record<string, string>) {
        onFinish(values);
    }

    return (
        <EditView >
            <EditViewHeader resource="users" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="first_name"
                        rules={{ required: "First name is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="Enter first name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_name"
                        rules={{ required: "Last name is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="Enter last name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        rules={{ required: "Email is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="Enter email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        rules={{ required: "Role is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {User.role.enumValues.map(value => (
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
