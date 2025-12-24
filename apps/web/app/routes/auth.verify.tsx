import type { Route } from "./+types/auth.login";
import { data, Link, redirect, useFetcher, type MetaDescriptor } from "react-router";
import { Mark } from "~/components/v3/logo";
import { Button } from "~/components/v3/core/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "~/components/v3/core/form";
import { formData } from "zod-form-data";
import z from "zod/v4";
import { EmailQueue, User } from "@bw/core";
import { crypt, gen_salt, increment } from "@bw/core/utils/drizzle";
import { UserOtp } from "@bw/core/schema/auth/user";
import { cookieSession } from "~/cookie";
import { getSession } from "~/utils/session";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "~/components/v3/core/input-otp";
import type { JWTPayload } from "jose";
import { and, eq, isNull, } from "drizzle-orm";
import { GradientBackground } from "~/components/v3/gradient";

export const meta = (): MetaDescriptor[] => [
    { title: "Signup" },
    { name: "description", content: "Sign in to your account to conitnue." },
];

export const action = async ({ request, context: { postgres, jwt } }: Route.ActionArgs) => {
    const session = await getSession(request, cookieSession)
    const form = await request.formData()

    const token = session.get('token')

    if (token == undefined) {
        throw new Error('not authenticated')
    }

    const { sub, exp } = jwt.decode<JWTPayload>(token) as Required<JWTPayload>

    if (exp <= Date.now()) {
        redirect('../')
    }

    switch (request.method.toLowerCase()) {
        case 'post': {
            const { code } = await formData({
                code: z.string("otp is required"),
            }).parseAsync(form)

            await postgres.transaction(async tx => {
                await tx.update(User).set({
                    status: 'active'
                }).where(and(
                    eq(User.uid, sub),
                    eq(User.status, 'pending')
                ))

                const otp = await tx.update(UserOtp).set({
                    attempts: increment(UserOtp.attempts),
                    consumed_at: new Date(),
                }).where(and(
                    eq(UserOtp.uid, sub),
                    eq(UserOtp.scope, 'verify_account'),
                    eq(UserOtp.hash, crypt(code, UserOtp.hash)),
                    isNull(UserOtp.consumed_at),
                )).returning().then(x => x.at(0))

                if (otp !== undefined && otp.expires_at <= new Date()) {
                    return data({ error: 'code expired' }, {
                        status: 400
                    })
                }
                else if (otp == undefined) {
                    return data({ error: 'code invalid' }, {
                        status: 400
                    })
                }
            })

            return redirect('/')
        };
        case 'put': {
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            await postgres.transaction(async tx => {
                await tx.update(UserOtp).set({
                    revoked_at: new Date()
                }).where(and(
                    eq(UserOtp.uid, sub),
                    isNull(UserOtp.consumed_at),
                    isNull(UserOtp.revoked_at),
                    eq(UserOtp.scope, 'verify_account'),
                )).returning()

                await tx.insert(UserOtp).values({
                    uid: sub,
                    hash: crypt(code, gen_salt('bf')),
                    scope: 'verify_account',
                    expires_at: new Date(Date.now() + 10 * 60 * 1e3),
                }).returning()

                await tx.insert(EmailQueue).values({
                    recipient: "seaszn.libertas@gmail.com",
                    sender: '"Maddison Foo Koch" <maddison53@ethereal.email>',
                    subject: "Hello ✔",
                })
            });

            return data({})
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