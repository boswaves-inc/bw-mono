import type { Route } from "./+types/auth.login";
import { data, Link, redirect, useFetcher, type MetaDescriptor } from "react-router";
import { Mark } from "~/components/v3/logo";
import { Button } from "~/components/v3/core/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "~/components/v3/core/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "~/components/v3/core/input-otp";
import { GradientBackground } from "~/components/v3/gradient";
import { formData } from "zod-form-data";
import z from "zod/v4";

export const meta = (): MetaDescriptor[] => [
    { title: "Signup" },
    { name: "description", content: "Sign in to your account to conitnue." },
];

export const loader = async ({ request, context: { auth } }: Route.LoaderArgs) => {
    await auth.authenticate(request, {
        onSuccess: '/',
        onFailure: '/auth/login'
    })

    return data(null)
}

export const action = async ({ request, context: { auth } }: Route.ActionArgs) => {
    const form = await request.formData()

    switch (request.method.toLowerCase()) {
        case 'post': {
            const { code } = await formData({
                code: z.string("otp is required"),
            }).parseAsync(form)

            try {
                return await auth.verify_confirm(request, code, {
                    onSuccess: '/',
                    onFailure: '/auth/login'
                })
            }
            catch (err: any) {
                return data({ error: err.message }, {
                    status: 400
                })
            }
        };
        case 'put': {
            try {
                return await auth.verify_resend(request, {
                    onFailure: '/auth/login'
                })
            }
            catch (err: any) {
                return data({ error: err.message }, {
                    status: 400
                })
            }
        };
    }

    return data({ error: 'method not allowed' }, 415)
}

export default () => {
    const form = useForm()
    const fetcher = useFetcher();

    const onResend = async () => {
        await fetcher.submit(null, {
            method: 'put',
            action: './'
        })
    }

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
                            <h1 className="mt-8 text-base/6 font-medium">Check your email!</h1>
                            <p className="mt-1 text-sm/5 text-gray-600">
                                Enter the code we sent to your email to reset your password.
                            </p>
                        </div>

                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className=" w-full justify-center flex" >
                                    <FormControl >
                                        <InputOTP {...field} maxLength={6}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div>
                            <button onClick={onResend} type="button" className="font-medium hover:text-gray-600 text-sm/5">
                                Didn't get a code?
                            </button>
                            <Button type="submit" className="w-full mt-4">
                                Submit
                            </Button>
                        </div>

                    </Form>
                    <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
                        Already a member?
                        <Link to="/auth/login" className="font-medium ml-2 hover:text-gray-600">
                            Login here
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}