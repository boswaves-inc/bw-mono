import { useForm } from "react-hook-form";
import type { Route } from "./+types/auth.recover";
import { Form, FormField, FormItem, FormLabel } from "~/components/v3/core/form";
import { data, Link, redirect } from "react-router";
import { Mark } from "~/components/v3/logo";
import { InputControl } from "~/components/v3/core/form/control";
import { Button } from "~/components/v3/core/button";
import { formData, zfd } from "zod-form-data";
import z from "zod/v4";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Recover" },
        { name: "description", content: "Sign in to your account to conitnue." },
    ];
}

export const action = async ({ request }: Route.ActionArgs) => {
    const form = await request.formData()
    const result = await formData({
        email: z.email("email is required"),
    }).parseAsync(form)

    console.log(result)

    return redirect('./code')
}
