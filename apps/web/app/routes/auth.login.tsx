import type { Route } from "./+types/auth.login";
import { data, Link } from "react-router";
import { Mark } from "~/components/v3/logo";
import { Button } from "~/components/v3/core/button";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "~/components/v3/core/form";
import { InputControl } from "~/components/v3/core/form/control";
import { formData } from "zod-form-data";
import { z } from "zod/v4";
import { User, UserCredentials } from "@bw/core";
import { and, eq, getTableColumns, ne } from "drizzle-orm";
import { crypt } from "@bw/core/utils/drizzle";
import { Session } from "@bw/core/schema/auth/session";
import { getSession } from "~/utils/session";
import { cookieSession } from "~/cookie";
import { GradientBackground } from "~/components/v3/gradient";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login" },
        { name: "description", content: "Sign in to your account to conitnue." },
    ];
}

export const action = async ({ request, context: { postgres, jwt } }: Route.ActionArgs) => {
    const form = await request.formData()
    const session = await getSession(request, cookieSession)

    const result = await formData({
        email: z.email("email is required"),
        password: z.string("password is required"),
    }).parseAsync(form)

    const { user, token } = await postgres.transaction(async tx => {
        const user = await tx.select({
            ...getTableColumns(User)
        })
            .from(User)
            .innerJoin(UserCredentials, eq(User.uid, UserCredentials.uid))
            .where(and(
                ne(User.status, 'deleted'),
                eq(User.email, result.email),
                eq(UserCredentials.password, crypt(result.password, UserCredentials.password)),
            )).then(x => x.at(0))

        if (user == undefined) {
            throw new Error('invalid credentials')
        }

        const [{ id, nonce, expired_at }] = await tx.insert(Session).values({
            uid: user.uid,
            expired_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        }).returning()

        const token = await jwt.sign({ nonce }, {
            exp: expired_at.valueOf(),
            sub: user.uid,
            jti: id
        })

        return { token, user }

    })

    session.set('token', token)

    if (user.status != 'active') {
        // redirect to confirm account
    }

    return data({}, {
        headers: [
            ['Set-Cookie', await cookieSession.commitSession(session)]
        ]
    })
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