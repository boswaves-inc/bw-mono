import type { Route } from "./+types/auth.login";
import { Outlet, redirect, type MetaDescriptor } from "react-router";
import { formData, zfd } from "zod-form-data";
import z from "zod/v4";
import { Email, EmailQueue, User, UserCredentials } from "@bw/core";
import { crypt, gen_salt } from "@bw/core/utils/drizzle";
import { UserOtp } from "@bw/core/schema/auth/user";
import { Session } from "@bw/core/schema/auth/session";
import { cookieSession } from "~/cookie";
import { getSession } from "~/utils/session";

export const meta = ({ }: Route.MetaArgs) => [
    { title: "Signup" },
    { name: "description", content: "Sign in to your account to conitnue." },
] satisfies MetaDescriptor[];

export const action = async ({ request, context: { postgres, chargebee, jwt } }: Route.ActionArgs) => {
    const form = await request.formData()
    const session = await getSession(request, cookieSession)

    const result = await formData({
        first_name: z.string("first name is required"),
        last_name: z.string("last name is required"),
        email: z.email("email is required"),
        password: z.string("password is required"),
        terms_of_aggreement: zfd.checkbox({ trueValue: 'true' }).refine(value => value, 'terms of agreement are required')
    }).parseAsync(form)

    const token = await postgres.transaction(async tx => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const [{ uid }] = await tx.insert(User).values({
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
        }).returning()

        const [{ id, nonce, expired_at }] = await tx.insert(Session).values({
            uid,
            expired_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        }).returning()

        await tx.insert(UserCredentials).values({
            uid,
            password: crypt(result.password, gen_salt('bf'))
        })

        await tx.insert(UserOtp).values({
            uid,
            hash: crypt(code, gen_salt('bf')),
            scope: 'verify_account',
            expires_at: new Date(Date.now() + 10 * 60 * 1e3),
        }).returning()

        await tx.insert(EmailQueue).values({
            recipient: "seaszn.libertas@gmail.com",
            sender: '"Maddison Foo Koch" <maddison53@ethereal.email>',
            subject: "Hello ✔",
        })

        await chargebee.customer.create({
            id: uid,
            email: result.email,
            last_name: result.last_name,
            first_name: result.first_name,
        });

        console.log(`'${code}'`)

        return await jwt.sign({ nonce }, {
            exp: expired_at.valueOf(),
            sub: uid,
            jti: id
        })
    });

    session.set('token', token)

    return redirect('./confirm', {
        headers: [
            ['Set-Cookie', await cookieSession.commitSession(session)]
        ]
    })
}

export default () => (
    <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <Outlet />
    </div>
)