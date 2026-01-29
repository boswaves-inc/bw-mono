import z from "zod/v4";
import { gen_fingerprint } from "~/utils";
import { Email } from '~/schema/index'
import { eq } from "drizzle-orm";
import { NatsRoute } from "./+types/send";
import { render } from "@react-email/components";
import { Layout } from "~/components/layout";
import Heading from "~/components/elements/heading";
import { element } from "~/components/utils";
import { createAuxiliaryTypeStore, printNode, zodToTs } from 'zod-to-ts'

export const meta = ({ }: NatsRoute.MetaArgs) => ({
})

export const schema = async ({ }: NatsRoute.SchemaArgs) => {
    const store = createAuxiliaryTypeStore()
    const { node } = zodToTs(z.array(element()), {
        auxiliaryTypeStore: store
    })

    store.definitions.forEach(({ node }) => {
        console.log(printNode(node))
    })

    console.log(printNode(node))

    return z.object({
        subject: z.string(),
        content: z.array(element()),
        to_emails: z.string().array(),
        cc_emails: z.string().array().optional().default([]),
        bcc_emails: z.string().array().optional().default([]),
    })
}

export default async ({ body, meta, logger, context: { postgres, smtp } }: NatsRoute.ActionArgs) => {
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

    const html = await render(
        <Layout>
            <Heading>
                {/* Verify your account */}
            </Heading>
            <Heading size="h3">
                {/* 000-000 */}
            </Heading>
        </Layout>
    )

    // Send the actual email
    const result = await smtp.send_mail({
        html,
        to: email.to_emails,
        cc: email.cc_emails,
        bcc: email.bcc_emails,
        subject: email.subject,
        from: 'support@boswaves.com',
    })

    console.log(result)

    // Mark as sent
    await postgres.update(Email).set({ status: 'sent', }).where(
        eq(Email.id, email.id)
    )

    logger.info({ email_id: email.id }, 'email sent')

}