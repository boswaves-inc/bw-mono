import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "~/components/v3/core/form";
import { data, Link, redirect, Form as ReactForm, useFetcher } from "react-router";
import { Mark } from "~/components/v3/logo";
import { Button } from "~/components/v3/core/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "~/components/v3/core/input-otp";
import type { Route } from "./+types/auth.recover.code";
import { formData } from "zod-form-data";
import z from "zod/v4";

export const action = async ({ request }: Route.ActionArgs) => {
    switch (request.method.toLowerCase()) {
        case 'post': {
            const form = await request.formData()
            const result = await formData({
                code: z.string("otp is required"),
            }).parseAsync(form)

            console.log(result)

            return redirect('../reset')
        };
        case 'put': {
            return redirect('.')
        };
    }

    return data('method not allowed', 405)
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
                Not your account?
                <Link to="/auth/login" className="font-medium ml-2 hover:text-gray-600">
                    Login here
                </Link>
            </div>
        </div>
    )
}