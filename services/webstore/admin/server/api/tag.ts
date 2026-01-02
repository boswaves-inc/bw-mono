import _ from 'lodash';
import express from 'express'
import cors from "cors";
import { and, eq, exists, ne } from 'drizzle-orm';
import type { Postgres } from '@boswaves/core/postgres'
import { Tag, ItemTag } from '@boswaves/core'
import { createInsertSchema } from "drizzle-zod";
import z, { union } from 'zod/v4';

export default ({ postgres }: { postgres: Postgres }) => {
    const router = express()

    // List
    router.get('/', async (req, res) => {
        try {
            const { _end, _start } = req.query;

            const start = Number(_start) ?? 0;
            const end = Number(_end) ?? 10;

            const data = await postgres.select().from(Tag).where(
                ne(Tag.status, 'deleted')
            ).offset(start).limit(end - start)

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
        const schema = union([
            z.object({
                status: z.enum(['archived', 'active'])
            }),
            z.object({
                name: z.string()
            })
        ])

        try {
            const data = await schema.parseAsync(req.body)

            await postgres.transaction(async tx => {
                if ('status' in data) {
                    await tx.update(ItemTag).set({
                        status: data.status,
                        updated_at: new Date()
                    }).where(and(
                        ne(ItemTag.status, 'deleted'),
                        eq(ItemTag.id, req.params.id),
                        exists(
                            tx.select()
                                .from(Tag)
                                .where(and(
                                    eq(Tag.id, ItemTag.id), // assuming the FK column is named tag_id
                                    eq(Tag.status, 'active')
                                ))
                        )
                    ))

                    await tx.update(Tag).set({
                        status: data.status,
                        updated_at: new Date()
                    }).where(and(
                        ne(Tag.status, 'deleted'),
                        eq(Tag.id, req.params.id)
                    ));

                }
                else {
                    await tx.update(Tag).set({
                        name: data.name,
                        updated_at: new Date()
                    }).where(and(
                        ne(Tag.status, 'deleted'),
                        eq(Tag.id, req.params.id)
                    ));
                }
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
            await postgres.transaction(async (tx) => {
                await tx.update(ItemTag).set({
                    status: 'deleted',
                    updated_at: new Date()
                }).where(and(
                    eq(ItemTag.id, req.params.id),
                    ne(ItemTag.status, 'deleted')
                ))

                await tx.update(Tag).set({
                    status: 'deleted',
                    updated_at: new Date()
                }).where(and(
                    ne(Tag.status, 'deleted'),
                    eq(Tag.id, req.params.id)
                ))
            })

            return res.json({ success: true })
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