import express from "express"
import type { Cookie, RouterContext } from "react-router";

export default ({ cookie }: { cookie: Cookie }) => {
    const router = express.Router();

    router.use(express.json());
    router.use(express.urlencoded({ extended: true }))

    router.post('/theme', async (req, res) => {
        const { theme } = req.body;

        if (theme !== 'dark' || theme !== 'light') {
            return res.status(400).json({ error: 'Invalid theme' })
        }

        return res.header('Set-Cookie', await cookie.serialize(theme)).json({ theme })
    })

    return router
}