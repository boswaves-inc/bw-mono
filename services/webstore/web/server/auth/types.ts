import type { SmtpClient } from "@boswaves-inc/smtp-sdk";
import type { Jwt } from "@boswaves-inc/webstore-core/jwt";
import type { JWTClaims } from "@boswaves-inc/webstore-core/jwt/types";
import type { Postgres } from "@boswaves-inc/webstore-core/postgres";
import type Chargebee from "chargebee";

export interface ResetToken extends JWTClaims {
    // verified: bool
    cc: boolean
}

export interface AuthToken extends JWTClaims {
    nonce: number
}

export interface AuthOptions {
    chargebee: Chargebee,
    postgres: Postgres,
    smtp: SmtpClient,
    jwt: Jwt
}

export type AuthRedirect = {
    onSuccess: string,
    onFailure: string,
    onVerify: string
}
