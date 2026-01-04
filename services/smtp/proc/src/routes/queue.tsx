import z from "zod/v4";

import { createInsertSchema } from "drizzle-zod";
import { idempotency_key } from "~/utils";
import { RouteMessage } from "~/types";
import { Email } from '~/schema/index'
import { eq } from "drizzle-orm";
import { formData } from "zod-form-data";

export const handle = {
    from_beginning: false
}

export const schema = formData({
    template: z.string(),
    to_emails: z.string().array(),
    cc_emails: z.string().array().optional().default([]),
    bcc_emails: z.string().array().optional().default([]),
})

export default async ({ message, context: { logger, postgres, smtp } }: RouteMessage) => {
    if (message.value == undefined) {
        return logger.error('missing message value')
    }

    try {
        const content = JSON.parse(message.value.toString())
        const body = await schema.parseAsync(content)
        const idem_key = idempotency_key(body)

        const existing = await postgres.query.Email.findFirst({
            where: eq(Email.idempotency_key, idem_key)
        })

        if (existing) {
            return logger.info({ idempotency_key: idem_key }, 'duplicate, skipping')
        }

        // Insert and process immediately
        const [email] = await postgres.insert(Email).values({
            ...body,
            idempotency_key: idem_key,
            status: 'processing',
        }).returning()

        // Send the actual email
        await smtp.send_mail({
            html: "",
            to: email.to_emails,
            cc: email.cc_emails,
            bcc: email.bcc_emails,
            subject: email.subject ?? undefined,
        })

        // Mark as sent
        await postgres.update(Email).set({ status: 'sent', }).where(
            eq(Email.id, email.id)
        )

        logger.info({ email_id: email.id }, 'email sent')
    } catch (error) {
        if (error instanceof SyntaxError) {
            logger.error({ raw: message.value.toString() }, 'invalid JSON')
            return
        }

        if (error instanceof z.ZodError) {
            logger.error({ issues: error.issues }, 'validation failed')
            return
        }

        throw error
    }
}