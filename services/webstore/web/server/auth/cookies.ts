import { createCookieSessionStorage } from "react-router";

export const authSession = createCookieSessionStorage<{ token: string }>({
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        secrets: ['session'],
        httpOnly: true,
        sameSite: 'lax',
        name: 'bw_token',
    }
})

export const recoverSession = createCookieSessionStorage<{ token: string }>({
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        secrets: ['session'],
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 10,
        name: 'bw_flash',
    }
})