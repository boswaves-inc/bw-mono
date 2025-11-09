import _ from 'lodash';
import express from 'express'
import { eq } from 'drizzle-orm';
import type Chargebee from 'chargebee'
import type { Postgres } from '@bw/core/postgres'
import { CouponData, CouponType, Item, ItemCoupon } from '@bw/core'
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from 'zod/v4';
import * as zfd from 'zod-form-data'

export default ({ postgres, chargebee }: { postgres: Postgres, chargebee: Chargebee }) => {
    const router = express()

    // List
    router.get('/', async (req, res) => {
        try {
            const { _end, _start } = req.query;

            const start = Number(_start) ?? 0;
            const end = Number(_end) ?? 10;

            const data = await postgres.select().from(CouponData).offset(start).limit(end - start)

            return res.json(data)
        }
        catch (err) {
            console.log(err)

            return res.destroy(err as any)
        }
    })

    // Create
    router.post('/', async (req, res) => {
        const base = createInsertSchema(Item)
            .extend(createInsertSchema(ItemCoupon).shape)
            .omit({
                id: true,
                type: true,
                value: true,
                created_at: true,
                updated_at: true,
                archived_at: true
            })

        const schema = z.discriminatedUnion('type', [
            base.extend({ type: z.literal('fixed'), value: zfd.numeric(z.int()) }),
            base.extend({ type: z.literal('percentage'), value: zfd.numeric(z.float64()) })
        ])

        try {
            const data = await schema.parseAsync(req.body)

            const result = await postgres.transaction(async (tx) => {
                const item = await tx.insert(Item).values(data).returning().then(x => x[0])
                const item_coupon = await tx.insert(ItemCoupon).values({
                    id: item.id,
                    type: data.type,
                    value: data.value,
                    apply_on: data.apply_on,

                }).returning().then(x => x[0])

                await tx.refreshMaterializedView(CouponData)
                await chargebee.coupon.createForItems({
                    id: item.id,
                    name: data.name,
                    apply_on: data.apply_on == 'invoice' ? 'invoice_amount' : 'each_specified_item',
                    discount_type: data.type == 'fixed' ? 'fixed_amount' : data.type,
                    discount_amount: data.type == 'fixed' ? data.value : undefined,
                    discount_percentage: data.type == 'percentage' ? data.value : undefined,
                })

                return _.merge(item, item_coupon)
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
            const [result] = await postgres.select().from(CouponData).where(eq(CouponData.id, req.params.id)).limit(1)

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })

    // Update
    router.patch('/:id', async (req, res) => {
        const base = createInsertSchema(Item)
            .extend(createInsertSchema(ItemCoupon).shape)
            .omit({
                id: true,
                type: true,
                value: true,
                created_at: true,
                updated_at: true,
                archived_at: true
            })

        const schema = z.discriminatedUnion('type', [
            base.extend({ type: z.literal('fixed'), value: zfd.numeric(z.int()) }),
            base.extend({ type: z.literal('percentage'), value: zfd.numeric(z.float64()) })
        ])
        try {
            const data = await schema.parseAsync(req.body)
            const result = await postgres.transaction(async tx => {
                const { id } = req.params

                const [current] = await tx.select().from(ItemCoupon).where(eq(Item.id, id))

                const type = data.type ?? current.type
                const amount = type == 'fixed' ? data.value : undefined
                const percentage = type == 'percentage' ? data.value : undefined

                await Promise.all([
                    tx.update(Item).set({ name: data.name, status: data.status, updated_at: new Date() }).where(eq(Item.id, id)),
                    tx.update(ItemCoupon).set({
                        type: data.type,
                        value: data.value,
                        apply_on: data.apply_on,
                    }).where(eq(ItemCoupon.id, id))
                ])

                await tx.refreshMaterializedView(CouponData)
                await chargebee.coupon.updateForItems(id, {
                    name: data.name,
                    discount_amount: amount,
                    discount_percentage: percentage,
                    discount_type: data.type == 'fixed' ? 'fixed_amount' : data.type,
                    apply_on: data.apply_on == 'invoice' ? 'invoice_amount' : 'each_specified_item',
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
                    tx.delete(ItemCoupon).where(eq(ItemCoupon.id, id))
                ])

                await tx.refreshMaterializedView(CouponData)
                await chargebee.coupon.delete(id)
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