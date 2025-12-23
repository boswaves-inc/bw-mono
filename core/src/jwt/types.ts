
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
    exp?: string | number; // e.g., '1h', '90d', 3600
    nbf?: string | number; // e.g., '5m', 300
    jti?: string; // JWT ID
    sub?: string; // Subject (typically user id)
}

export interface VerifyOptions {
    iss?: string;
    aud?: string | string[];
    sub?: string;
    maxTokenAge?: string | number;
}