import { User } from '@bw/core'
import type { Postgres } from '@bw/core/postgres'
import type Chargebee from 'chargebee'
import express from 'express'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { eq } from 'drizzle-orm';
import _ from 'lodash';

export default ({ postgres, chargebee }: { postgres: Postgres, chargebee: Chargebee }) => {
    const router = express()

    // List
    router.get('/', async (req, res) => {
        const { _end, _start } = req.query;

        const start = Number(_start) ?? 0;
        const end = Number(_end) ?? 10;

        const data = await postgres.select().from(User).offset(start).limit(end - start)

        return res.json(data)
    })

    // Create
    router.post('/', async (req, res) => {
        const schema = createInsertSchema(User).omit({ cbid: true })

        try {
            const data = await schema.parseAsync(req.body)
            const cb = await chargebee.customer.create({
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
            });

            const result = await postgres.insert(User).values({
                cbid: cb.customer.id,
                ...data,
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
        const schema = createSelectSchema(User)

        try {
            const [result] = await postgres.selectDistinct().from(User).where(eq(User.uid, req.params.id)).limit(1)

            return res.json(result).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })

    // Update
    router.patch('/:id', async (req, res) => {
        const schema = createUpdateSchema(User)

        try {
            const data = await schema.parseAsync(req.body)
            const [current] = await postgres.select().from(User).where(eq(User.uid, req.params.id))

            const pg_result = await postgres.update(User).set({ ...data, updated_at: new Date() }).where(eq(User.uid, req.params.id))
            const cb_result = await chargebee.customer.update(current.cbid, {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email
            })

            return res.json(_.merge(cb_result.customer, { rows: pg_result })).sendStatus(200)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })

    // Delete
    router.delete('/:id', async (req, res) => {
        try {
            const [current] = await postgres.select().from(User).where(eq(User.uid, req.params.id));

            if (current) {
                await Promise.all([
                    postgres.delete(User).where(eq(User.uid, req.params.id)),
                    chargebee.customer.delete(current.cbid, { delete_payment_method: true })
                ])
                return res.json(current).sendStatus(200)
            }

            return res.json({ message: 'not found' }).status(400)
        }
        catch (err) {
            return res.destroy(err as any)
        }
    })


    return router
}