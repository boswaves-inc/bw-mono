import _ from 'lodash';
import express from 'express'
import cors from "cors";
import { and, eq, getTableColumns, isNotNull, ne } from 'drizzle-orm';
import type Chargebee from 'chargebee'
import type { Postgres } from '@bw/core/postgres'
import { Item, ItemPrice, PeriodUnit, PricingModel, ItemScript, Status, Tag } from '@bw/core'
import type { TradingView } from '@bw/core/tradingview';
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z, { array } from 'zod/v4';
import { zfd } from 'zod-form-data';
import { json_agg_object } from '@bw/core/utils/drizzle.ts';

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
            console.log(err)

            return res.destroy(err as any)
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

            return res.json(result).status(200)
        }
        catch (err: any) {
            console.log(err)

            return res.sendStatus(404)
        }
    })

    // Show
    router.get('/:id', async (req, res) => {
        try {
            const [result] = await postgres.select().from(Tag).where(
                eq(Tag.id, req.params.id)
            ).limit(1)

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })

    // Update
    router.patch('/:id', async (req, res) => {
        const schema = createUpdateSchema(Tag).omit({
            id: true,
            status: true,
            created_at: true,
            updated_at: true
        }).extend({
            status: z.enum(['archived', 'active'])
        })

        try {
            const data = await schema.parseAsync(req.body)

            await postgres.transaction(async tx => {
                if (data.name != undefined || data.status != undefined) {
                    await tx.update(Tag).set({
                        name: data.name,
                        status: data.status,
                        updated_at: new Date()
                    }).where(eq(Tag.id, req.params.id));
                }
            })

            return res.sendStatus(200)
        }
        catch (err: any) {
            console.error(err)

            return res.destroy(err as any)
        }
    })

    // Delete
    router.delete('/:id', async (req, res) => {
        const { id } = req.params

        try {
            const result = await postgres.transaction(async (tx) => {
                return await tx.update(Tag).set({
                    status: 'deleted',
                    updated_at: new Date()
                }).returning().then(x => x[0])
            })

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            console.error(err)

            return res.destroy(err as any)
        }
    })

    return router
}