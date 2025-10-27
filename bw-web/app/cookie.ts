import { createCookie, createCookieSessionStorage } from "react-router";

export const sessionCookie = createCookieSessionStorage({
    cookie: {
        name: "session",
        secrets: ["your-secret"],
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
});

export const themeCookie = createCookie('theme', {
    httpOnly: true,
    sameSite: 'lax',
    secrets: ['theme']
})