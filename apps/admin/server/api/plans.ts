import _ from 'lodash';
import express from 'express'
import fileupload from "express-fileupload";
import cors from "cors";
import { eq } from 'drizzle-orm';
import type Chargebee from 'chargebee'
import type { Postgres } from '@bw/core/postgres'
import { Item, ItemPrice, ItemScript,  PeriodUnit, PlanData, PriceModel } from '@bw/core'
import type { TradingView } from '@bw/core/tradingview';
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z, { array, object } from 'zod/v4';
import { repeatableOfType, zfd } from 'zod-form-data';

export default ({ family, postgres, tradingview, chargebee }: { family: string, postgres: Postgres, chargebee: Chargebee, tradingview: TradingView }) => {
    const router = express()

    // List
    router.get('/', async (req, res) => {
        try {
            const { _end, _start } = req.query;

            const start = Number(_start) ?? 0;
            const end = Number(_end) ?? 10;

            const data = await postgres.select().from(PlanData).offset(start).limit(end - start)

            return res.json(data)
        }
        catch (err) {
            console.log(err)

            return res.destroy(err as any)
        }
    })

    // Create
    router.post('/', cors(), express.json(), express.urlencoded({ extended: true }), async (req, res) => {
        const schema = createInsertSchema(Item)
            .extend(createInsertSchema(ItemScript).shape)
            .extend({
                item_price: array(z.object({
                    price: zfd.numeric(),
                    currency_code: zfd.text(),
                    pricing_model: z.enum(PriceModel.enumValues),
                    period_unit: z.enum(PeriodUnit.enumValues),
                }).nullable()).transform(x => x.filter(x => x != undefined))
            })
            .omit({
                id: true,
                image: true,
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
                const item = await tx.insert(Item).values({
                    ...data,
                    type: 'plan'
                }).returning().then(x => x[0])

                const item_script = await tx.insert(ItemScript).values({
                    ...data,
                    id: item.id,
                    uuid: script.uuid,
                    image: script.image.big
                }).returning().then(x => x[0]);

                const prices = await tx.insert(ItemPrice).values(data.item_price.map(price => ({
                    id: item.id,
                    ...price,
                }))).returning()

                await chargebee.item.create({
                    id: item.id,
                    type: 'plan',
                    name: _.snakeCase(data.name),
                    // included_in_mrr: true,
                    item_family_id: family,
                    external_name: data.name,
                    'cf_tv_uuid': script.uuid,
                    'cf_tv_type': data.type,
                })

                const item_prices = await Promise.all(prices.map(({ id, period_unit, price, pricing_model, currency_code }) => (
                    chargebee.itemPrice.create({
                        id,
                        price,
                        period: 1,
                        name: _.snakeCase(`${data.name}_${currency_code}_${period_unit}`),
                        period_unit,
                        currency_code,
                        item_id: item.id,
                        pricing_model,
                    })
                )))

                return _.merge(item, { item_prices, item_script })
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
            const [result] = await postgres.select().from(PlanData).where(eq(PlanData.id, req.params.id)).limit(1)

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

                await chargebee.item.delete(id)

                await Promise.all([
                    tx.delete(Item).where(eq(Item.id, id)),
                    tx.delete(ItemScript).where(eq(ItemScript.id, id))
                ])

                await tx.refreshMaterializedView(PlanData)
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