import { createHash } from "crypto"

export const idempotency_key = <T>(body: T) => {
    return createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0, 32)
}

import { render as renderTemplate, toPlainText } from '@react-email/components';
import { ReactNode } from "react";
import { formData } from 'zod-form-data'
import z, { ZodType } from "zod/v4";

type Renderer<T extends z.ZodType> = (data: z.output<T>) => ReactNode

export const template = <T extends ZodType>(name: string, shape: T, render: Renderer<T>) => {
    const handler = (data: unknown) => formData(shape).parseAsync(data).then(async x => {
        const html = await renderTemplate(render(x))
        const text = toPlainText(html)

        return { html, text, default: html }
    }).catch(err => {
        throw err
    })

    return { name, handler, render }
}