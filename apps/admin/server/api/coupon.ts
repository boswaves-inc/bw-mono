import _ from 'lodash';
import express from 'express'
import cors from "cors";
import { and, eq, exists, getTableColumns, inArray, isNotNull, ne, not, sql } from 'drizzle-orm';
import type Chargebee from 'chargebee'
import type { Postgres } from '@bw/core/postgres'
import { Item, ItemPrice, PeriodUnit, ItemPriceModel, ItemScript, Status, ItemTag, Tag, Script, Coupon, CouponApplication, CouponDiscount, CouponDuration } from '@bw/core'
import { createInsertSchema } from "drizzle-zod";
import z, { array } from 'zod/v4';
import { zfd } from 'zod-form-data';

export default ({ postgres, chargebee }: { postgres: Postgres, chargebee: Chargebee }) => {
    const router = express()

    // List
    router.get('/', async (req, res) => {
        const { _end, _start } = req.query;

        const start = Number(_start) ?? 0;
        const end = Number(_end) ?? 10;

        try {


            const data = await postgres.select({
                ...getTableColumns(Coupon),
                //             // item_tag: coalesce(
                //             //     json_agg_object({
                //             //         ...getTableColumns(Tag)
                //             //     }, isNotNull(Tag.id)),
                //             //     sql`'[]'::json`
                //             // ).as('item_tag'),
                //             // item_price: coalesce(
                //             //     json_agg_object({
                //             //         ...getTableColumns(ItemPrice)
                //             //     }, isNotNull(ItemPrice.id)),
                //             //     sql`'[]'::json`
                //             // ).as('item_price'),
                //             // item_script: ItemScript,
            }).from(Coupon)
                //             // .innerJoin(ItemScript, eq(ItemScript.item_id, Item.id))
                //             // .leftJoin(ItemPrice,
                //             //     and(
                //             //         eq(ItemPrice.item_id, Item.id),
                //             //         ne(ItemPrice.status, 'deleted')
                //             //     )
                //             // )
                //             // .leftJoin(ItemTag,
                //             //     and(
                //             //         eq(ItemTag.item_id, Item.id),
                //             //         eq(ItemTag.status, Item.status)
                //             //     )
                //             // )
                //             // .leftJoin(Tag,
                //             //     and(
                //             //         eq(ItemTag.id, Tag.id),
                //             //         eq(ItemTag.status, Tag.status)
                //             //     )
                //             // )
                //             .where(
                //                 eq(Item.type, 'coupon'),
                //             )
                //             .groupBy(Item.id, ItemScript.id, ItemScript.item_id)
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
        const schema = z.object({
            name: z.string(),
            apply_on: z.enum(CouponApplication.enumValues),
            valid_from: z.string().transform(x => new Date(Date.parse(x))).optional(),
            valid_till: z.string().transform(x => new Date(Date.parse(x))).optional(),
            max_redemptions: zfd.numeric().optional()
        }).refine(({ valid_from, valid_till }) => {
            if (valid_from == undefined && valid_till == undefined) {
                return true
            }
            else if (valid_from != undefined && valid_till != undefined) {
                return valid_till > valid_from
            }

            return false
        }).and(
            z.discriminatedUnion('discount_type', [
                z.object({
                    discount_type: z.literal('fixed_amount'),
                    discount_amount: zfd.numeric(),
                    discount_currency: z.string(),
                }),
                z.object({
                    discount_type: z.literal('percentage'),
                    discount_percentage: zfd.numeric(),
                })
            ])
        ).and(
            z.discriminatedUnion('duration_type', [
                z.object({
                    duration_type: z.literal('limited_period'),
                    period: zfd.numeric(),
                    period_unit: z.enum(PeriodUnit.enumValues)
                }),
                z.object({
                    duration_type: z.enum(['one_time', 'forever']),
                })
            ])
        )

        //         & ({
        //     discount_type: "fixed_amount";
        //     discount_amount: number;
        //     discount_currency: string;
        // } | {
        //     discount_type: "percentage";
        //     discount_percentage: number;
        // })) & ({
        //     duration_type: "limited_period";
        //     period: number;
        //     period_unit: "day" | "week" | "month" | "year";
        // } | {
        //     duration_type: "one_time" | "forever";
        // })

        try {
            const data = await schema.parseAsync(req.body) as {
                name: string;
                apply_on: CouponApplication;
                valid_from?: Date | undefined;
                valid_till?: Date | undefined;
                discount_amount?: number | undefined;
                discount_currency?: string | undefined;
                discount_percentage?: number | undefined;
                max_redemptions?: number | undefined;
                duration_type: CouponDuration;
                period?: number | undefined;
                period_unit?: "day" | "week" | "month" | "year";
            }

            const result = await postgres.transaction(async (tx) => {
                // const [script] = await postgres.select().from(Script).where(
                //     eq(Script.uuid, data.item_script)
                // )

                const coupon = await tx.insert(Coupon).values({
                    ...data as any,
                    status: 'active'
                }).returning().then(([item]) => item)


                console.log(coupon)

                const item = await chargebee.coupon.createForItems({
                    ...data,
                    id: coupon.id,
                    valid_from: data.valid_from?.valueOf(),
                    valid_till: data.valid_till?.valueOf(),
                })

                // item.coupon.
                // console.log(item)

                //                 await chargebee.item.create({
                //     id: item.id,
                //     type: 'plan',
                //     name: _.snakeCase(data.name),
                //     // included_in_mrr: true,
                //     item_family_id: family,
                //     external_name: data.name,
                //     'cf_tv_uuid': script.uuid,
                //     'cf_tv_type': script.type,
                // })

            })

            throw new Error('test')
            //     const item = await tx.insert(Item).values({
            //         ...data,
            //         type: 'plan',
            //         status: 'active'
            //     }).returning().then(x => x[0])

            //     const item_script = await tx.insert(ItemScript).values({
            //         id: script.id,
            //         item_id: item.id,
            //         status: 'active',
            //         uuid: script.uuid,
            //     }).returning().then(x => x[0]);

            //     const prices = data.item_price.length > 0 ? await tx.insert(ItemPrice).values(data.item_price.map(price => ({
            //         ...price,
            //         item_id: item.id,
            //         status: 'active' as Status,
            //         name: _.snakeCase(`${data.name}_${price.currency_code}_${price.period_unit}`),
            //     }))).returning() : []

            //     await chargebee.item.create({
            //         id: item.id,
            //         type: 'plan',
            //         name: _.snakeCase(data.name),
            //         // included_in_mrr: true,
            //         item_family_id: family,
            //         external_name: data.name,
            //         'cf_tv_uuid': script.uuid,
            //         'cf_tv_type': script.type,
            //     })

            //     await Promise.all(prices.map(({ id, period_unit, price, pricing_model, currency_code }) => (
            //         chargebee.itemPrice.create({
            //             id,
            //             price,
            //             period: 1,
            //             name: _.snakeCase(`${data.name}_${currency_code}_${period_unit}`),
            //             period_unit,
            //             currency_code,
            //             item_id: item.id,
            //             pricing_model,
            //         })
            //     )))

            //     return _.merge(item, { item_prices: prices, item_script })
            // })

            return res.json(result)
        }
        catch (err: any) {
            console.log(err)

            return res.sendStatus(404)
        }
    })

    return router
}