import type { Smtp } from "@boswaves-inc/smtp-sdk";
import type { Jwt } from "../services/jwt";
import type { JWTClaims } from "../services/jwt/types";
import type { Postgres } from "../services/postgres";
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
    smtp: Smtp,
    jwt: Jwt
}

export type AuthRedirect = {
    onSuccess: string,
    onFailure: string,
    onVerify: string
}
