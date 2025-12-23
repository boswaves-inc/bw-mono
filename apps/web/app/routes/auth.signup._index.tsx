import type { Route } from "./+types/auth.login";
import { Link, type MetaDescriptor } from "react-router";
import { Mark } from "~/components/v3/logo";
import { Button } from "~/components/v3/core/button";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "~/components/v3/core/form";
import { CheckboxControl, InputControl } from "~/components/v3/core/form/control";

export const meta = ({ }: Route.MetaArgs) => [
    { title: "Signup" },
    { name: "description", content: "Sign in to your account to conitnue." },
] satisfies MetaDescriptor[];

export default () => {
    const form = useForm()

    return (
        <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
            <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
                <Form control={form} method="post" action="./" className="p-7 sm:p-11 space-y-8">
                    <div>
                        <div className="flex items-start">
                            <Link to="/" title="Home">
                                <Mark className="h-9 fill-black" />
                            </Link>
                        </div>
                        <h1 className="mt-8 text-base/6 font-medium">Become a member!</h1>
                        <p className="mt-1 text-sm/5 text-gray-600">
                            Sign up to your account to continue.
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <FormField
                            name="first_name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>First name</FormLabel>
                                    <InputControl autoFocus required  {...field} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="last_name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Last name</FormLabel>
                                    <InputControl required {...field} />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Email</FormLabel>
                                <InputControl required type="email" {...field} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Password</FormLabel>
                                <InputControl required type="password" {...field} />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-between text-sm/5">
                        <FormField
                            name="terms_of_aggreement"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                    <CheckboxControl required {...field} />
                                    <FormLabel>I accept the terms of aggreement</FormLabel>
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button type="submit" className="w-full">
                        Sign up
                    </Button>
                    {/* <div className="flex gap-2 h-0 overflow-visible items-center ">
                        <span className=" border-t w-full" />
                        <Paragraph className="text-nowrap">
                            Or continue with
                        </Paragraph>
                        <span className=" border-t w-full" />
                    </div>
                    <Button type="button" variant="secondary" className="w-full flex gap-3">
                        <img src="/partners/google.svg" className="size-4" />
                        Google
                    </Button> */}
                </Form>
                <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
                    Already a member?
                    <Link to="../login" className="font-medium ml-2 hover:text-gray-600">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    )
}