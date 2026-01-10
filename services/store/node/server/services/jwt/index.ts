import { importPKCS8, importSPKI, jwtVerify, SignJWT, type JWTPayload, type JWTVerifyResult } from "jose";
import type { JWTConfig, JWTClaims, VerifyOptions, Algorithm } from "./types";
import { join } from "path";
import { readFile } from "fs";

export class Jwt {
    private _secret?: Uint8Array;
    private _algorithm: Algorithm;
    private _issuer?: string;
    private _audience?: string | string[];
    private _keys?: CryptoKeyPair;

    private _init: Promise<void>;

    constructor(config: JWTConfig) {
        this._algorithm = config.algorithm ?? 'HS256';
        this._issuer = config.issuer;
        this._audience = config.audience;

        // Initialize keys asynchronously
        this._init = this._initialize(config);
    }

    private async _initialize(config: JWTConfig): Promise<void> {
        if ('secret' in config) {
            // HMAC (symmetric)
            this._secret = new TextEncoder().encode(config.secret);
        }
        else if (config.keys) {
            // RSA/EC (asymmetric)
            const algorithm = this._algorithm.startsWith('RS')
                ? 'RS256'
                : this._algorithm.startsWith('ES')
                    ? 'ES256'
                    : this._algorithm;

            const privateKey = await new Promise<string>((resolve, reject) => {
                return readFile(join(process.cwd(), config.keys.private_key), 'utf-8', (err, data) => {
                    if (err) {
                        reject(err)

                        return
                    }

                    resolve(data)
                })
            })

            const publicKey = await new Promise<string>((resolve, reject) => {
                return readFile(join(process.cwd(), config.keys.public_key), 'utf-8', (err, data) => {
                    if (err) {
                        reject(err)

                        return
                    }

                    resolve(data)
                })
            })

            this._keys = {
                privateKey: await importPKCS8(privateKey, algorithm),
                publicKey: await importSPKI(publicKey, algorithm)
            }
        }
        else {
            throw new Error('Must provide either secret (HMAC) or privateKey + publicKey (RSA/EC)');
        }
    }

    /**
     * Sign a JWT with the provided payload
     */
    async sign<T extends { [key: string]: unknown }>(payload: T, claims: JWTClaims): Promise<string> {
        await this._init;

        let signer = new SignJWT({ ...payload, ...claims })
            .setProtectedHeader({ alg: this._algorithm })
            .setExpirationTime(claims.exp)
            .setIssuedAt(claims.iat)
            .setSubject(claims.sub)
            .setJti(claims.jti);

        // Set defaults from config
        if (this._issuer) {
            signer = signer.setIssuer(this._issuer);
        }

        if (this._audience) {
            signer = signer.setAudience(this._audience);
        }

        if (claims?.nbf) {
            signer = signer.setNotBefore(claims.nbf);
        }

        return await signer.sign(this._keys?.privateKey ?? this._secret!);
    }


    /**
     * Verify and decode a JWT
     */
    async verify<T extends JWTPayload = JWTPayload>(token: string, options?: VerifyOptions): Promise<JWTVerifyResult<T>> {
        await this._init;

        const verifyOptions: Parameters<typeof jwtVerify>[2] = {};

        // Use defaults from config
        if (this._issuer || options?.iss) {
            verifyOptions.issuer = options?.iss ?? this._issuer;
        }
        if (this._audience || options?.aud) {
            verifyOptions.audience = options?.aud ?? this._audience;
        }
        if (options?.sub) {
            verifyOptions.subject = options.sub;
        }

        if (options?.maxTokenAge) {
            verifyOptions.maxTokenAge = options.maxTokenAge;
        }

        return await jwtVerify<T>(token, this._keys?.publicKey ?? this._secret!, verifyOptions);
    }

    /**
     * Decode a JWT without verifying (use with caution!)
     */
    public decode<T extends JWTPayload = JWTPayload>(token: string): T & JWTPayload {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const payload = JSON.parse(
            Buffer.from(parts[1], 'base64url').toString('utf-8')
        );

        return payload as T & JWTPayload;
    }
}
