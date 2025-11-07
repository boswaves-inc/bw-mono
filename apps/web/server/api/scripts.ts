import _ from 'lodash';
import express from 'express'
import { eq } from 'drizzle-orm';
import type Chargebee from 'chargebee'
import type { Postgres } from '@bw/core/postgres'
import { Item, ItemScript, Script } from '@bw/core'
import type { TradingView } from '@bw/core/tradingview';
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export default ({ family, postgres, tradingview, chargebee }: { family: string, postgres: Postgres, chargebee: Chargebee, tradingview: TradingView }) => {
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
            console.log(err)

            return res.destroy(err as any)
        }
    })

    // Create
    router.post('/', async (req, res) => {
        const schema = createInsertSchema(Item)
            .extend(createInsertSchema(ItemScript).shape)
            .omit({
                id: true,
                created_at: true,
                updated_at: true,
                archived_at: true
            })

        try {
            const data = await schema.parseAsync(req.body)
            const script = await tradingview.script(data.uuid)

            if ("detail" in script) {
                return res.json(script).status(400)
            }

            const result = await postgres.transaction(async (tx) => {
                const item = await tx.insert(Item).values(data).returning().then(x => x[0])
                const item_script = await tx.insert(ItemScript).values({ ...data, id: item.id, uuid: script.uuid }).returning().then(x => x[0])

                await tx.refreshMaterializedView(Script)

                await chargebee.item.create({
                    type: 'plan',
                    id: item.id,
                    name: _.snakeCase(data.name),
                    // included_in_mrr: true,
                    item_family_id: family,
                    external_name: data.name,
                })

                return _.merge(item, item_script)
            })

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            console.error(err)

            return res.destroy(err as any)
        }
    })

    // Show
    router.get('/:id', async (req, res) => {
        try {
            const [result] = await postgres.select().from(Script).where(eq(Script.id, req.params.id)).limit(1)

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })

    // Update
    router.patch('/:id', async (req, res) => {
        const schema = createUpdateSchema(Item)
            .extend(createUpdateSchema(ItemScript).shape)
            .omit({
                id: true,
                created_at: true,
                updated_at: true,
                archived_at: true
            })

        try {
            const data = await schema.parseAsync(req.body)
            const result = await postgres.transaction(async tx => {
                const { id } = req.params

                await Promise.all([
                    tx.update(Item).set({ name: data.name, status: data.status, updated_at: new Date() }).where(eq(Item.id, id)),
                    tx.update(ItemScript).set({ uuid: data.uuid }).where(eq(ItemScript.id, id))
                ])

                await tx.refreshMaterializedView(Script)

                await chargebee.item.update(id, {
                    name: _.snakeCase(data.name),
                    external_name: data.name
                })
            })

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })

    // Delete
    router.delete('/:id', async (req, res) => {
        try {
            const result = await postgres.transaction(async tx => {
                const { id } = req.params

                await Promise.all([
                    tx.delete(Item).where(eq(Item.id, id)),
                    tx.delete(ItemScript).where(eq(ItemScript.id, id))
                ])

                await tx.refreshMaterializedView(Script)
                await chargebee.item.delete(id)
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