import type { Route } from "./+types/auth.login";
import { Outlet, redirect, type MetaDescriptor } from "react-router";
import { formData, zfd } from "zod-form-data";
import z from "zod/v4";
import { User, UserCredentials } from "@bw/core";
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

        const { customer } = await chargebee.customer.create({
            email: result.email,
            last_name: result.last_name,
            first_name: result.first_name,
        });

        const [{ uid }] = await tx.insert(User).values({
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
            cbid: customer.id,
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
            type: 'verify_account',
            expires_at: new Date(Date.now() + 10 * 60 * 1e3),
        }).returning()

        // await smtp.send({
        //     from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
        //     to: "seaszn.libertas@gmail.com",
        //     subject: "Hello ✔",
        //     text: `Hello world?: ${code}`, // Plain-text version of the message
        //     html: `<b>Hello world? ${code}</b>`, // HTML version of the message
        // });

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