import _ from 'lodash';
import express from 'express'
import cors from "cors";
import { and, eq, exists, ne } from 'drizzle-orm';
import type { Postgres } from '@boswaves-inc/webstore-core/postgres'
import { Script, ItemScript, ScriptType } from '@boswaves-inc/webstore-core'
import type { TradingView } from '@boswaves-inc/webstore-core/tradingview';
import { createInsertSchema } from "drizzle-zod";
import z from 'zod/v4';

export default ({ postgres, tradingview }: { postgres: Postgres, tradingview: TradingView }) => {
    const router = express()

    // List
    router.get('/', async (req, res) => {
        try {
            const { _end, _start } = req.query;

            const start = Number(_start) ?? 0;
            const end = Number(_end) ?? 10;

            const data = await postgres.select().from(Script).offset(start).limit(end - start)

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
        const schema = createInsertSchema(Script).omit({
            id: true,
            name: true,
            image: true,
            status: true,
            created_at: true,
            updated_at: true
        })

        try {
            const data = await schema.parseAsync(req.body)
            const script = await tradingview.script(data.uuid)

            if ("detail" in script) {
                return res.json(script).status(400)
            }

            const result = await postgres.transaction(async (tx) => {
                return await tx.insert(Script).values({
                    status: 'active',
                    type: data.type,
                    uuid: data.uuid,
                    name: script.name,
                    image: script.image.big,
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
            const [result] = await postgres.select().from(Script).where(
                eq(Script.id, req.params.id)
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
        const schema = z.union([
            z.object({
                name: z.string(),
                type: z.enum(ScriptType.enumValues),
            }),
            z.object({
                status: z.enum(['archived', 'active'])
            })
        ])

        try {
            const data = await schema.parseAsync(req.body)

            await postgres.transaction(async tx => {
                if ('status' in data) {
                    await tx.update(ItemScript).set({
                        status: data.status,
                        updated_at: new Date()
                    }).where(and(
                        ne(ItemScript.status, 'deleted'),
                        eq(ItemScript.id, req.params.id),
                        exists(
                            tx.select()
                                .from(Script)
                                .where(and(
                                    eq(Script.id, ItemScript.id),
                                    eq(Script.status, 'active')
                                ))
                        )
                    ))

                    await tx.update(Script).set({
                        status: data.status,
                        updated_at: new Date(),
                    }).where(and(
                        ne(Script.status, 'deleted'),
                        eq(Script.id, req.params.id)
                    ));

                }
                else {
                    await tx.update(Script).set({
                        type: data.type,
                        name: data.name,
                        updated_at: new Date(),
                    }).where(and(
                        ne(Script.status, 'deleted'),
                        eq(Script.id, req.params.id)
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
            const result = await postgres.transaction(async (tx) => {
                await tx.update(ItemScript).set({
                    status: 'deleted',
                    updated_at: new Date()
                }).where(and(
                    eq(ItemScript.id, req.params.id),
                    ne(ItemScript.status, 'deleted')
                ))

                return await tx.update(Script).set({
                    status: 'deleted',
                    updated_at: new Date()
                }).where(and(
                    ne(Script.status, 'deleted'),
                    eq(Script.id, req.params.id)
                )).returning().then(x => x[0])
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