import z from "zod/v4";
import { idempotency_key } from "~/utils";
import { Context, RouteMessage } from "~/types";
import { formData } from "zod-form-data";

export const schema = z.object({
    to_emails: z.string().array(),
    cc_emails: z.string().array().optional().default([]),
    bcc_emails: z.string().array().optional().default([]),
})

export default ({ logger }: Context) => {
    return async ({ message }: RouteMessage) => {
        if (message.value == undefined) {
            logger.error('missing message value')

            return
        }

        const content = message.value.toString()

        const body = await schema.parseAsync(JSON.parse(content))
        const key = idempotency_key(content)

        logger.warn({ key, body }, 'email-scheduled')
    }
}