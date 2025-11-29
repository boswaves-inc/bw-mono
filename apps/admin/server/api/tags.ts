import _ from 'lodash';
import express from 'express'
import cors from "cors";
import { eq } from 'drizzle-orm';
import type { Postgres } from '@bw/core/postgres'
import { Item, Tag, ItemTag } from '@bw/core'
import type { TradingView } from '@bw/core/tradingview';
import { createInsertSchema } from "drizzle-zod";
import z, { object } from 'zod/v4';

export default ({ postgres, tradingview }: { postgres: Postgres, tradingview: TradingView }) => {
    const router = express()

    // List
    router.get('/', async (req, res) => {
        try {
            const { _end, _start } = req.query;

            const start = Number(_start) ?? 0;
            const end = Number(_end) ?? 10;

            const data = await postgres.select().from(Tag).offset(start).limit(end - start)

            return res.json(data)
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).send(err.message)
            }

            return res.status(500).send(err)
        }
    })

    // Create
    router.post('/', cors(), express.json(), express.urlencoded({ extended: true }), async (req, res) => {
        const schema = createInsertSchema(Tag).omit({
            id: true,
            status: true,
            created_at: true,
            updated_at: true
        })

        try {
            const data = await schema.parseAsync(req.body)
            const result = await postgres.transaction(async (tx) => {
                return await tx.insert(Tag).values({
                    status: 'active',
                    name: data.name,
                }).returning().then(x => x[0])
            })

            return res.json(result)
        }
        catch (err: any) {
            if (err instanceof Error) {
                return res.status(500).send(err.message)
            }

            return res.status(500).send(err)
        }
    })

    // Show
    router.get('/:id', async (req, res) => {
        try {
            const [result] = await postgres.select().from(Tag).where(
                eq(Tag.id, req.params.id)
            ).limit(1)

            return res.json(result)
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).send(err.message)
            }

            return res.status(500).send(err)
        }
    })

    // Update
    router.patch('/:id', async (req, res) => {
        const schema = object({
            name: z.string(),
            status: z.enum(['archived', 'active'])
        })

        try {
            const data = await schema.parseAsync(req.body)

            await postgres.transaction(async tx => {
                await tx.update(Tag).set({
                    name: data.name,
                    status: data.status,
                    updated_at: new Date()
                }).where(eq(Tag.id, req.params.id));

                await tx.update(ItemTag).set({
                    status: data.status,
                    updated_at: new Date()
                }).where(eq(ItemTag.id, req.params.id))
            })

            return res.sendStatus(200)
        }
        catch (err: any) {
            console.error(err)

            if (err instanceof Error) {
                return res.status(500).send(err.message)
            }

            return res.status(500).send(err)
        }
    })

    // Delete
    router.delete('/:id', async (req, res) => {
        try {
            const result = await postgres.transaction(async (tx) => {
                await tx.update(ItemTag).set({
                    status: 'deleted',
                    updated_at: new Date()
                }).where(eq(ItemTag.id, req.params.id))

                return await tx.update(Tag).set({
                    status: 'deleted',
                    updated_at: new Date()
                }).where(
                    eq(Item.id, req.params.id)
                ).returning().then(x => x[0])
            })

            return res.json(result)
        }
        catch (err) {
            console.error(err)

            if (err instanceof Error) {
                return res.status(500).send(err.message)
            }

            return res.status(500).send(err)
        }
    })

    return router
}