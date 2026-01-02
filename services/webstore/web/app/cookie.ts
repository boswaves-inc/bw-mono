import { createCookieSessionStorage } from "react-router";

export const cookieSession = createCookieSessionStorage<{ token: string, cart: string }>({
    cookie: {
        secrets: ['session'],
        sameSite: 'lax',
        name: 'bw_session',
    }
})