import type { SmtpOptions } from "./smtp"

if (!process.env.SMTP_HOST) {
    throw new Error('SMTP_HOST variable not set')
}

if (!process.env.SMTP_EMAIL) {
    throw new Error('SMTP_EMAIL variable not set')
}

if (!process.env.SMTP_PASSWORD) {
    throw new Error('SMTP_PASSWORD variable not set')
}

export default {
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.STMP_PORT ? Number(process.env.STMP_PORT) : 5432,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    } satisfies SmtpOptions
}