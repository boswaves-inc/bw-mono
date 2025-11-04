// import { Textarea } from "@/components/ui/textarea";
import { Item, Status, User, UserProvider } from "@bw/core";
import { useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "~/components/core/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/core/form";
import { Input } from "~/components/core/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/core/select";
import { Textarea } from "~/components/core/textarea";
import { CreateView, CreateViewHeader } from "~/components/refine/views/create";
import _ from 'lodash';

export default () => {
    const navigate = useNavigate();

    const { refineCore: { onFinish }, ...form } = useForm<User>({
        refineCoreProps: {},
    });

    function onSubmit(values: Record<string, string>) {
        onFinish(values);
    }

    return (
        <CreateView>
            <CreateViewHeader />
            <Form {...form} >
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
