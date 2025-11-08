import { createCookieSessionStorage, createSessionStorage } from "react-router";

export const cartSession = createCookieSessionStorage<{ id: string }>({
    cookie: {
        secrets: ['session'],
        sameSite: 'lax',
        name: 'cart',
    }
})