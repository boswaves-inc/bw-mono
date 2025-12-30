import type { JWTPayload } from "jose";

export type Algorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512'

export type JWTConfig = {
    algorithm?: Algorithm;
    issuer?: string;
    audience?: string | string[];
} & ({
    keys: {
        private_key: string,
        public_key: string
    }
} | {
    secret: string;
})

export interface JWTClaims {
    /**
     * JWT Expiration Time
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4 RFC7519#section-4.1.4}
     */
    exp: number

    /**
     * JWT ID
     *
     * 
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7 RFC7519#section-4.1.7}
     */
    jti: string

    /**
     * JWT Subject
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2 RFC7519#section-4.1.2}
     */
    sub: string

    /**
     * JWT Issued At
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6 RFC7519#section-4.1.6}
     */
    iat: number

    /**
     * JWT Issuer
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1 RFC7519#section-4.1.1}
     */
    iss?: string

    /**
     * JWT Audience
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3 RFC7519#section-4.1.3}
     */
    aud?: string | string[]

    /**
     * JWT Not Before
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5 RFC7519#section-4.1.5}
     */
    nbf?: number

    [propName: string]: unknown


}

export interface VerifyOptions {
    iss?: string;
    aud?: string | string[];
    sub?: string;
    maxTokenAge?: string | number;
}



// /** Recognized JWT Claims Set members, any other members may also be present. */
// export interface JWTPayload {
//   /**
//    * JWT Issuer
//    *
//    * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1 RFC7519#section-4.1.1}
//    */
//   iss: string

//   /**
//    * JWT Subject
//    *
//    * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2 RFC7519#section-4.1.2}
//    */
//   sub?: string

//   /**
//    * JWT Audience
//    *
//    * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3 RFC7519#section-4.1.3}
//    */
//   aud?: string | string[]

//   /**
//    * JWT ID
//    *
//    * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7 RFC7519#section-4.1.7}
//    */
//   jti?: string

//   /**
//    * JWT Not Before
//    *
//    * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5 RFC7519#section-4.1.5}
//    */
//   nbf?: number

//   /**
//    * JWT Expiration Time
//    *
//    * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4 RFC7519#section-4.1.4}
//    */
//   exp?: number

//   /**
//    * JWT Issued At
//    *
//    * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6 RFC7519#section-4.1.6}
//    */
//   iat?: number

//   /** Any other JWT Claim Set member. */
//   [propName: string]: unknown
// }