import { Item } from '@bw/core'
import type { Postgres } from '@bw/core/postgres'
import type Chargebee from 'chargebee'
import express from 'express'

export default ({ postgres, chargebee }: { postgres: Postgres, chargebee: Chargebee }) => {
    const router = express()

    router.get('/', async (req, res) => {
        const { _end, _start } = req.query;

        const start = Number(_start) ?? 0;
        const end = Number(_end) ?? 10;

        const data = await postgres.select().from(Item).offset(start).limit(end - start)

        return res.json(data)
    })

    router.post('/', (req, res) => {
        console.log('create')

        return res.sendStatus(200)
    })

    router.get('/:id', (req, res) => {
        console.log('show')

        return res.sendStatus(200)
    })

    router.post('/:id', (req, res) => {
        console.log('edit')

        return res.sendStatus(200)
    })

    router.delete('/:id', (req, res) => {
        console.log('delete')

        return res.sendStatus(200)
    })

    return router
}