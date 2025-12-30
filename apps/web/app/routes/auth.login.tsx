import type { Route } from "./+types/auth.login";
import { data, Link } from "react-router";
import { Mark } from "~/components/v3/logo";
import { Button } from "~/components/v3/core/button";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "~/components/v3/core/form";
import { InputControl } from "~/components/v3/core/form/control";
import { formData } from "zod-form-data";
import { z } from "zod/v4";
import { GradientBackground } from "~/components/v3/gradient";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login" },
        { name: "description", content: "Sign in to your account to conitnue." },
    ];
}

export const loader = async ({ request, context: { auth } }: Route.LoaderArgs) => {
    await auth.authenticate(request, {
        onSuccess: '/',
        onVerify: '/auth/verify'
    })

    return data(null)
}

export const action = async ({ request, context: { auth } }: Route.ActionArgs) => {
    const form = await request.formData()

    switch (request.method.toLowerCase()) {
        case 'post': {
            // Validate the form data
            const result = await formData({
                email: z.email("email is required"),
                password: z.string("password is required"),
            }).parseAsync(form)

            // authenticate the user
            return auth.login(request, result.email, result.password, {
                onSuccess: '/',
                onVerify: '/auth/verify'
            })
        }
    }

    return data({ error: 'method not allowed' }, { status: 415 })

}

export default () => {
    const form = useForm()

    return (
        <main className="overflow-hidden bg-gray-50">
            <GradientBackground />
            <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
                <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
                    <Form control={form} method="post" action="./" className="p-7 sm:p-11 space-y-8">
                        <div>
                            <div className="flex items-start">
                                <Link to="/" title="Home">
                                    <Mark className="h-9 fill-black" />
                                </Link>
                            </div>
                            <h1 className="mt-8 text-base/6 font-medium">Welcome back!</h1>
                            <p className="mt-1 text-sm/5 text-gray-600">
                                Sign in to your account to continue.
                            </p>
                        </div>

                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Email</FormLabel>
                                    <InputControl required autoFocus type="email" {...field} />
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

                        <div className="flex items-center text-sm/5">
                            {/* <FormField
                            name="remember_me"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                    <CheckboxControl {...field} />
                                    <FormLabel>Remember me</FormLabel>
                                </FormItem>
                            )}
                        /> */}
                            <Link to="/auth/recover" className="font-medium hover:text-gray-600">
                                Forgot password?
                            </Link>

                        </div>
                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>
                        {/* <div className="flex gap-2 items-center ">
                        <span className=" border-t w-full" />
                        <Paragraph className="text-nowrap">
                            Or continue with
                        </Paragraph>
                        <span className=" border-t w-full" />
                    </div>
                    <div>
                        <Button type="button" variant="secondary" className="w-full flex gap-3">
                            <img src="/partners/google.svg" className="size-4" />
                            Google
                        </Button>
                    </div> */}
                    </Form>
                    <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
                        Not a member?
                        <Link to="/auth/signup" className="font-medium ml-2 hover:text-gray-600">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}