import { GradientBackground } from "~/components/v3/gradient";
import type { Route } from "./+types/auth.recover";
import { data, Outlet } from "react-router";
import { formData } from "zod-form-data";
import z from "zod/v4";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Recover" },
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
    switch (request.method.toLowerCase()) {
        case 'post': {
            try {

                const form = await request.formData()

                // Validate the form data
                const result = await formData({
                    email: z.email("email is required"),
                }).parseAsync(form)

                // Request the recovery OTP
                return await auth.recover(request, result.email, {
                    onSuccess: './code'
                })
            }
            catch ({ message }: any) {
                return data<{ error: string }>({ error: message }, { status: 400 })
            }
        }
    }

    return data({ error: 'method not allowed' }, { status: 415 })
}

export default () => (
    <main className="overflow-hidden bg-gray-50">
        <GradientBackground />
        <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
            <Outlet />
        </div>
    </main>
)