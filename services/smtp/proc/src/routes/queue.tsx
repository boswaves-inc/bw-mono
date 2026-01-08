import z from "zod/v4";

import { gen_fingerprint } from "~/utils";
import { Email } from '~/schema/index'
import { eq } from "drizzle-orm";
import { RouteMessage } from "./_base";

export const handle = {
    from_beginning: false
}

export const schema = z.object({
    to_emails: z.string().array(),
    cc_emails: z.string().array().optional().default([]),
    bcc_emails: z.string().array().optional().default([]),
})

export default async ({ body, context: { logger, postgres, smtp } }: RouteMessage<typeof schema>) => {
    try {
        const fingerprint = gen_fingerprint(body)
        
        const existing = await postgres.query.Email.findFirst({
            where: eq(Email.fingerprint, fingerprint)
        })

        if (existing) {
            return logger.info({ fingerprint }, 'duplicate, skipping')
        }

        // Insert and process immediately
        const [email] = await postgres.insert(Email).values({
            ...body, fingerprint, status: 'processing',
        }).returning()

        // // Send the actual email
        // await smtp.send_mail({
        //     html: "",
        //     to: email.to_emails,
        //     cc: email.cc_emails,
        //     bcc: email.bcc_emails,
        //     subject: email.subject ?? undefined,
        // })

        // Mark as sent
        await postgres.update(Email).set({ status: 'sent', }).where(
            eq(Email.id, email.id)
        )

        // logger.info({ email_id: email.id }, 'email sent')
    } catch (error) {
        if (error instanceof SyntaxError) {
            logger.error(body, 'invalid JSON')
            return
        }

        if (error instanceof z.ZodError) {
            logger.error({ issues: error.issues }, 'validation failed')
            return
        }

        throw error
    }
}