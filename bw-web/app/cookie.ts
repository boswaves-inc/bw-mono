import { createCookieSessionStorage } from "react-router";

export const sessionCookie = createCookieSessionStorage({
    cookie: {
        name: "boswaves",
        secrets: ["your-secret"],
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
});