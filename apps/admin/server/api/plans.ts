import _ from 'lodash';
import express from 'express'
import cors from "cors";
import { and, eq, getTableColumns, isNotNull, ne } from 'drizzle-orm';
import type Chargebee from 'chargebee'
import type { Postgres } from '@bw/core/postgres'
import { Item, ItemPrice, PeriodUnit, PricingModel, ItemScript, Status } from '@bw/core'
import type { TradingView } from '@bw/core/tradingview';
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z, { array } from 'zod/v4';
import { zfd } from 'zod-form-data';
import { json_agg_object } from '@bw/core/utils/drizzle.ts';

export default ({ family, postgres, tradingview, chargebee }: { family: string, postgres: Postgres, chargebee: Chargebee, tradingview: TradingView }) => {
    const router = express()

    // List
    router.get('/', async (req, res) => {
        try {
            const { _end, _start } = req.query;

            const start = Number(_start) ?? 0;
            const end = Number(_end) ?? 10;

            const data = await postgres.select({
                id: Item.id,
                name: Item.name,
                type: Item.type,
                slug: Item.slug,
                status: Item.status,
                script: ItemScript,
                item_price: json_agg_object({
                    ...getTableColumns(ItemPrice)
                }, isNotNull(ItemPrice.id)),
            }).from(Item)
                .innerJoin(ItemScript, eq(ItemScript.id, Item.id))
                .leftJoin(ItemPrice,
                    and(
                        eq(ItemPrice.item_id, Item.id),
                        ne(ItemPrice.status, 'deleted')
                    )
                )
                .where(
                    eq(Item.type, 'plan'),
                )
                .groupBy(Item.id, ItemScript.id)
                .offset(start)
                .limit(end - start)

            return res.json(data)
        }
        catch (err) {
            console.log(err)

            return res.destroy(err as any)
        }
    })

    // Create
    router.post('/', cors(), express.json(), express.urlencoded({ extended: true }), async (req, res) => {
        const schema = createInsertSchema(Item).omit({
            status: true
        })
            .extend(createInsertSchema(ItemScript).shape)
            .extend({
                item_price: array(z.object({
                    price: zfd.numeric(),
                    period: zfd.numeric(),
                    currency_code: zfd.text(),
                    period_unit: z.enum(PeriodUnit.enumValues),
                    pricing_model: z.enum(PricingModel.enumValues),
                })).nullable()
                    .default([])
                    .transform(x => x?.filter(x => x != undefined) ?? [])
            })
            .omit({
                id: true,
                image: true,
                created_at: true,
                updated_at: true,
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
                    type: 'plan',
                    status: 'active'
                }).returning().then(x => x[0])

                const item_script = await tx.insert(ItemScript).values({
                    ...data,
                    id: item.id,
                    uuid: script.uuid,
                    image: script.image.big
                }).returning().then(x => x[0]);

                const prices = data.item_price.length > 0 ? await tx.insert(ItemPrice).values(data.item_price.map(price => ({
                    ...price,
                    item_id: item.id,
                    status: 'active' as Status,
                    name: _.snakeCase(`${data.name}_${price.currency_code}_${price.period_unit}`),
                }))).returning() : []

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

                await Promise.all(prices.map(({ id, period_unit, price, pricing_model, currency_code }) => (
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

                return _.merge(item, { item_prices: prices, item_script })
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
            const [result] = await postgres.select({
                id: Item.id,
                name: Item.name,
                type: Item.type,
                slug: Item.slug,
                status: Item.status,
                script: ItemScript,
                item_price: json_agg_object({
                    ...getTableColumns(ItemPrice)
                }, isNotNull(ItemPrice.id)),
            }).from(Item)
                .innerJoin(ItemScript, eq(ItemScript.id, Item.id))
                .leftJoin(ItemPrice,
                    and(
                        eq(ItemPrice.item_id, Item.id),
                        ne(ItemPrice.status, 'deleted')
                    ))
                .groupBy(Item.id, ItemScript.id)
                .where(
                    and(
                        eq(Item.id, req.params.id),
                        ne(Item.status, 'deleted'),
                    )
                )
                .limit(1)

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })

    // Update
    router.patch('/:id', async (req, res) => {
        const schema = createUpdateSchema(Item).omit({
            status: true
        }).extend({
            status: z.enum(['active', 'archived']),
            script: createInsertSchema(ItemScript).omit({
                id: true,
                image: true
            }),
            item_price: array(z.object({
                id: zfd.text().optional().nullable(),
                price: zfd.numeric(),
                period: zfd.numeric(),
                period_unit: z.enum(PeriodUnit.enumValues),
                currency_code: zfd.text(),
                pricing_model: z.enum(PricingModel.enumValues),
            }).nullable()).transform(x => x.filter(x => x != undefined))
        }).omit({
            id: true,
            created_at: true,
            updated_at: true,
        })

        try {
            const data = await schema.parseAsync(req.body)

            await postgres.transaction(async tx => {
                if (data.name != undefined || data.status != undefined) {
                    await tx.update(Item).set({
                        name: data.name,
                        status: data.status,
                        updated_at: new Date()
                    }).where(eq(Item.id, req.params.id));
                }

                await tx.insert(ItemScript).values({
                    image: '',
                    id: req.params.id,
                    uuid: data.script.uuid,
                    type: data.script.type,
                    description: data.script.description,
                }).onConflictDoUpdate({
                    target: ItemScript.id,
                    set: {
                        uuid: data.script.uuid,
                        type: data.script.type,
                        description: data.script.description
                    }
                })

                const current_prices = await tx.select().from(ItemPrice).where(
                    and(
                        eq(ItemPrice.item_id, req.params.id),
                        ne(ItemPrice.status, 'deleted')
                    )
                )

                const item_prices = await Promise.all(data.item_price.map(({ id, period, price, currency_code, pricing_model, period_unit }) => (
                    tx.insert(ItemPrice).values({
                        price,
                        period,
                        period_unit,
                        currency_code,
                        pricing_model,
                        status: 'active',
                        id: id ?? undefined,
                        item_id: req.params.id,
                        name: _.snakeCase(`${data.name}_${currency_code}_${period_unit}`),
                    }).onConflictDoUpdate(({
                        target: [ItemPrice.item_id, ItemPrice.period, ItemPrice.period_unit, ItemPrice.currency_code],
                        set: {
                            price,
                            pricing_model
                        },
                        targetWhere: ne(ItemPrice.status, 'deleted')
                    })).returning().then(x => ({ ...x[0], created: id == undefined }))
                )))

                console.log(data.item_price)

                const deleted_prices = current_prices.filter(x => item_prices.findIndex(y => y.id == x.id) == -1)

                await Promise.all(deleted_prices.map(item_price => tx.update(ItemPrice).set({
                    status: 'deleted'
                }).where(eq(ItemPrice.id, item_price.id))))

                await Promise.all([
                    ...deleted_prices.map(({ id }) => {
                        return chargebee.itemPrice.delete(id)
                    }),
                    ...item_prices.map(async ({ created, id, price, currency_code, pricing_model, period_unit }) => {
                        if (created) {
                            return chargebee.itemPrice.create({
                                id,
                                price,
                                period: 1,
                                period_unit,
                                pricing_model,
                                currency_code,
                                item_id: req.params.id,
                                name: _.snakeCase(`${data.name}_${currency_code}_${period_unit}`),
                            })
                        }

                        return chargebee.itemPrice.update(id, {
                            price,
                            period: 1,
                            name: _.snakeCase(`${data.name}_${currency_code}_${period_unit}`),
                            period_unit,
                            currency_code,
                            pricing_model,
                        })
                    })
                ])

                await chargebee.item.update(req.params.id, {
                    name: _.snakeCase(data.name),
                    external_name: data.name,
                    status: data.status,
                    'cf_tv_uuid': data.script.uuid,
                    'cf_tv_type': data.type,
                })
            })

            return res.json({}).sendStatus(200)
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

            const result = await postgres.transaction(async tx => {
                await tx.update(ItemPrice).set({
                    status: 'deleted',
                    updated_at: new Date()
                }).where(
                    and(
                        eq(ItemPrice.item_id, id),
                        eq(ItemPrice.status, 'active')
                    )
                ).returning().then(items => Promise.all(items.map(x => (
                    chargebee.itemPrice.delete(x.id)
                ))))

                await tx.update(Item).set({
                    status: 'deleted',
                    updated_at: new Date()
                }).where(
                    and(
                        eq(Item.id, id),
                        eq(Item.status, 'active')
                    )
                ).returning().then(async ({ length }) => {
                    if (length > 0) {
                        await chargebee.item.delete(id)
                    }
                })
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