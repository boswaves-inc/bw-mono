import { Item } from '@bw/core'
import type { Postgres } from '@bw/core/postgres'
import type Chargebee from 'chargebee'
import express from 'express'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { eq } from 'drizzle-orm';

export default ({ postgres, chargebee }: { postgres: Postgres, chargebee: Chargebee }) => {
    const router = express()

    router.get('/', async (req, res) => {
        const { _end, _start } = req.query;

        const start = Number(_start) ?? 0;
        const end = Number(_end) ?? 10;

        const data = await postgres.select().from(Item).offset(start).limit(end - start)

        return res.json(data)
    })

    router.post('/', async (req, res) => {
        const schema = createInsertSchema(Item)

        try {
            const data = await schema.parseAsync(req.body)
            const result = await postgres.insert(Item).values(data)

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })

    router.get('/:id', async (req, res) => {
        const schema = createSelectSchema(Item)

        try {
            const [result] = await postgres.selectDistinct().from(Item).where(eq(Item.id, req.params.id)).limit(1)

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })

    router.patch('/:id', async (req, res) => {
        const schema = createUpdateSchema(Item)

        try {
            const data = await schema.parseAsync(req.body)
            const result = await postgres.update(Item).set({ ...data, updated_at: new Date() }).where(eq(Item.id, req.params.id))

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })

    router.delete('/:id', async (req, res) => {
        try {
            const result = await postgres.delete(Item).where(eq(Item.id, req.params.id))

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })


    return router
}