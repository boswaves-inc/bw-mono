import nodemailer, { TransportOptions, SendMailOptions } from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SMTPPool from "nodemailer/lib/smtp-pool"
import { Postgres } from "./postgres"

export class Smtp {
    private _postgres: Postgres
    private _inner: nodemailer.Transporter<SMTPPool.SentMessageInfo, SMTPPool.Options>

    constructor({ postgres, options }: { postgres: Postgres, options: SMTPPool.Options }) {
        this._inner = nodemailer.createTransport(options)
        this._postgres = postgres
    }

    async send_mail(options: SendMailOptions) {
        await this._inner.sendMail(options)
    }
}