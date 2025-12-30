import _ from 'lodash';
import express from 'express'
import cors from "cors";
import { and, eq, exists, getTableColumns, inArray, isNotNull, ne, not, sql } from 'drizzle-orm';
import type Chargebee from 'chargebee'
import type { Postgres } from '@bw/core/postgres'
import { Item, ItemPrice, PeriodUnit, ItemPriceModel, ItemScript, ItemTag, Tag, Script } from '@bw/core'
import { createInsertSchema } from "drizzle-zod";
import z, { array } from 'zod/v4';
import { zfd } from 'zod-form-data';
import { coalesce, json_agg_object } from '@bw/core/utils/drizzle';

export default ({ family, postgres, chargebee }: { family: string, postgres: Postgres, chargebee: Chargebee }) => {
    const router = express()

    // List
    router.get('/', async (req, res) => {
        const { _end, _start } = req.query;

        const start = Number(_start) ?? 0;
        const end = Number(_end) ?? 10;

        try {
            const data = await postgres.select({
                ...getTableColumns(Item),
                item_tag: coalesce(
                    json_agg_object({
                        ...getTableColumns(Tag)
                    }, isNotNull(Tag.id)),
                    sql`'[]'::json`
                ).as('item_tag'),
                item_price: coalesce(
                    json_agg_object({
                        ...getTableColumns(ItemPrice)
                    }, isNotNull(ItemPrice.id)),
                    sql`'[]'::json`
                ).as('item_price'),
                item_script: ItemScript,
            }).from(Item)
                .innerJoin(ItemScript, eq(ItemScript.item_id, Item.id))
                .leftJoin(ItemPrice,
                    and(
                        eq(ItemPrice.item_id, Item.id),
                        ne(ItemPrice.status, 'deleted')
                    )
                )
                .leftJoin(ItemTag,
                    and(
                        eq(ItemTag.item_id, Item.id),
                        eq(ItemTag.status, Item.status)
                    )
                )
                .leftJoin(Tag,
                    and(
                        eq(ItemTag.id, Tag.id),
                        eq(ItemTag.status, Tag.status)
                    )
                )
                .where(
                    eq(Item.type, 'plan'),
                )
                .groupBy(Item.id, ItemScript.id, ItemScript.item_id)
                .offset(start)
                .limit(end - start)

            return res.json(data)
        }
        catch (err) {
            console.error(err)

            if (err instanceof Error) {
                return res.status(500).json(err.message)
            }

            return res.status(500).json(err)
        }
    })

    // Create
    router.post('/', cors(), express.json(), express.urlencoded({ extended: true }), async (req, res) => {
        const schema = createInsertSchema(Item)
            .extend({
                name: z.string(),
                status: z.enum(['active', 'archived']),
                item_tag: array(z.string()),
                item_script: z.string(),
                item_price: array(z.object({
                    price: zfd.numeric(),
                    period: zfd.numeric(),
                    currency_code: zfd.text(),
                    period_unit: z.enum(PeriodUnit.enumValues),
                    pricing_model: z.enum(ItemPriceModel.enumValues),
                })).nullable()
                    .default([])
                    .transform(x => x?.filter(x => x != undefined) ?? []),
            })
            .omit({
                id: true,
                type: true,
                status: true,
                created_at: true,
                updated_at: true,
            })

        try {
            const data = await schema.parseAsync(req.body)

            const result = await postgres.transaction(async (tx) => {
                const [script] = await postgres.select().from(Script).where(
                    eq(Script.uuid, data.item_script)
                )

                const item = await tx.insert(Item).values({
                    ...data,
                    type: 'plan',
                    status: 'active'
                }).returning().then(x => x[0])

                const item_script = await tx.insert(ItemScript).values({
                    id: script.id,
                    item_id: item.id,
                    status: 'active',
                    uuid: script.uuid,
                }).returning().then(x => x[0]);

                const prices = data.item_price.length > 0 ? await tx.insert(ItemPrice).values(data.item_price.map(price => ({
                    ...price,
                    item_id: item.id,
                    status: 'active' as any,
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
                    'cf_tv_type': script.type,
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

            return res.json(result)
        }
        catch (err: any) {
            console.log(err)

            return res.sendStatus(404)
        }
    })

    // Read
    router.get('/:id', async (req, res) => {
        const [result] = await postgres.select({
            ...getTableColumns(Item),
            item_tag: coalesce(
                json_agg_object({
                    ...getTableColumns(ItemTag)
                }, isNotNull(ItemTag.id)),
                sql`'[]'::json`
            ).as('item_tag'),
            item_price: coalesce(
                json_agg_object({
                    ...getTableColumns(ItemPrice)
                }, isNotNull(ItemPrice.id)),
                sql`'[]'::json`
            ).as('item_price'),
            item_script: ItemScript,
        }).from(Item)
            .innerJoin(ItemScript,
                eq(ItemScript.item_id, Item.id)
            )
            .leftJoin(ItemPrice,
                and(
                    eq(ItemPrice.item_id, Item.id),
                    ne(ItemPrice.status, 'deleted')
                )
            )
            .leftJoin(ItemTag,
                and(
                    eq(ItemTag.item_id, Item.id),
                    eq(ItemTag.status, Item.status),
                )
            )
            .groupBy(Item.id, ItemScript.id, ItemScript.item_id)
            .where(
                and(
                    eq(Item.id, req.params.id),
                    ne(Item.status, 'deleted'),
                )
            )
            .limit(1)

        return res.json(result)
    })

    // Update
    router.patch('/:id', cors(), express.json(), express.urlencoded({ extended: true }), async (req, res) => {
        const schema = z.union([
            z.object({
                status: z.enum(['active', 'archived']),
            }),
            z.object({
                name: z.string(),
                item_tag: array(z.string()),
                item_script: z.string(),
                item_price: array(z.object({
                    id: zfd.text().optional().nullable(),
                    price: zfd.numeric(),
                    period: zfd.numeric(),
                    period_unit: z.enum(PeriodUnit.enumValues),
                    currency_code: zfd.text(),
                    pricing_model: z.enum(ItemPriceModel.enumValues),
                }).nullable()).transform(x => x.filter(x => x != undefined)),
            })
        ])

        try {
            const data = await schema.parseAsync(req.body)

            await postgres.transaction(async tx => {
                if ('status' in data) {
                    await Promise.all([
                        tx.update(Item).set({
                            status: data.status,
                            updated_at: new Date()
                        }).where(and(
                            eq(Item.id, req.params.id),
                            ne(Item.status, 'deleted')
                        )),
                        tx.update(ItemPrice).set({
                            status: data.status,
                            updated_at: new Date()
                        }).where(and(
                            eq(ItemPrice.item_id, req.params.id),
                            ne(ItemPrice.status, 'deleted'),
                        )),
                        tx.update(ItemScript).set({
                            status: data.status,
                            updated_at: new Date()
                        }).where(and(
                            eq(ItemScript.item_id, req.params.id),
                            ne(ItemScript.status, 'deleted'),
                            exists(
                                tx.select().from(Script).where(and(
                                    eq(Script.id, ItemScript.id),
                                    eq(Script.status, 'active')
                                ))
                            )
                        )),
                        tx.update(ItemTag).set({
                            status: data.status,
                            updated_at: new Date()
                        }).where(and(
                            eq(ItemTag.item_id, req.params.id),
                            ne(ItemTag.status, 'deleted'),
                            exists(
                                tx.select().from(Tag).where(and(
                                    eq(Tag.id, ItemTag.id),
                                    eq(Tag.status, 'active')
                                ))
                            )
                        )),
                    ])

                    await chargebee.item.update(req.params.id, {
                        status: data.status,
                    })
                }
                else {
                    const script = await postgres.select().from(Script).where(and(
                        eq(Script.uuid, data.item_script),
                        eq(Script.status, 'active')
                    )).then(x => x.at(0))

                    if (script == undefined) {
                        throw new Error('script is archived')
                    }

                    const [_arg0, _arg1, _arg2, ...actual] = await Promise.all([
                        tx.update(Item).set({
                            name: data.name,
                            updated_at: new Date()
                        }).where(eq(Item.id, req.params.id)),
                        tx.update(ItemScript).set({
                            uuid: script.uuid,
                            updated_at: new Date()
                        }).where(and(
                            eq(ItemScript.item_id, req.params.id),
                            eq(ItemScript.status, 'active')
                        )),
                        tx.update(ItemTag).set({
                            status: 'deleted',
                            updated_at: new Date()
                        }).where(and(
                            eq(ItemTag.status, 'active'),
                            eq(ItemTag.item_id, req.params.id),
                            not(inArray(ItemTag.slug, data.item_tag)),
                        )),
                        ...data.item_price.map(({ id, period, price, currency_code, pricing_model, period_unit }) => (
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
                            }).onConflictDoUpdate({
                                target: [ItemPrice.item_id, ItemPrice.period, ItemPrice.period_unit, ItemPrice.currency_code],
                                set: {
                                    price,
                                    pricing_model,
                                    updated_at: new Date()
                                },
                                targetWhere: ne(ItemPrice.status, 'deleted')
                            }).returning().then(x => ({ ...x[0], created: id == undefined }))
                        )),
                    ])

                    const deleted = await tx.update(ItemPrice).set({
                        status: 'deleted'
                    }).where(and(
                        eq(ItemPrice.status, 'active'),
                        eq(ItemPrice.item_id, req.params.id),
                        not(inArray(ItemPrice.id, actual.map(x => x.id)))
                    )).returning();

                    // Update the chargebee root item instance 
                    await chargebee.item.update(req.params.id, {
                        name: _.snakeCase(data.name),
                        external_name: data.name,
                        'cf_tv_uuid': script.uuid,
                        'cf_tv_type': script.type,
                    })

                    await Promise.all([
                        ...deleted.map(({ id }) => chargebee.itemPrice.delete(id)),
                        ...actual.map(async ({ created, id, price, currency_code, pricing_model, period_unit }) => {
                            if (created == true) {
                                return await chargebee.itemPrice.create({
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
                            else {
                                return await chargebee.itemPrice.update(id, {
                                    price,
                                    period: 1,
                                    name: _.snakeCase(`${data.name}_${currency_code}_${period_unit}`),
                                    period_unit,
                                    currency_code,
                                    pricing_model,
                                })
                            }
                        })
                    ])
                }
            })

            return res.json({})
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
        const { id } = req.params

        await postgres.transaction(async tx => {
            // Delete the item price objects
            await tx.update(ItemPrice).set({
                status: 'deleted',
                updated_at: new Date()
            }).where(and(
                ne(ItemPrice.status, 'deleted'),
                eq(ItemPrice.item_id, id),
            )).returning().then(items => Promise.all(items.map(x => (
                chargebee.itemPrice.delete(x.id)
            ))))

            // Delte the item price objects
            await tx.update(ItemScript).set({
                status: 'deleted',
                updated_at: new Date()
            }).where(and(
                ne(ItemScript.status, 'deleted'),
                eq(ItemScript.item_id, id),
            ))

            // Delete the item tag objects
            await tx.update(ItemTag).set({
                status: 'deleted',
                updated_at: new Date()
            }).where(and(
                ne(ItemPrice.status, 'deleted'),
                eq(ItemTag.item_id, id),
            )).returning()

            // Delete the root item object
            await tx.update(Item).set({
                status: 'deleted',
                updated_at: new Date()
            }).where(and(
                ne(ItemPrice.status, 'deleted'),
                eq(Item.id, id),
            )).returning().then(async ({ length }) => {
                if (length > 0) {
                    await chargebee.item.delete(id)
                }
            })
        })

        return res.send('success')
    })

    return router
}