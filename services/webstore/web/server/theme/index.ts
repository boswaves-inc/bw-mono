import express from "express"
import { createCookie } from "react-router";
import type { Theme } from "./types";

const cookie = createCookie('theme', {
    httpOnly: true,
    sameSite: 'lax',
    secrets: ['theme']
})

export default () => {
    const router = express.Router();

    router.post('/theme', express.json(), express.urlencoded({ extended: true }), async (req, res) => {
        const { theme } = req.body;

        if (theme !== 'dark' || theme !== 'light') {
            return res.status(400).json({ error: 'Invalid theme' })
        }

        return res.header('Set-Cookie', await cookie.serialize(theme)).json({ theme })
    }
    )

    return router
}

export const getTheme = async (req: express.Request): Promise<Theme> => {
    const theme = await cookie.parse(req.headers.cookie ?? '').then(x => x ?? 'dark')

    return theme
}