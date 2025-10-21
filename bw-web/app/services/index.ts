import { Postgres } from '~/libs/postgres'
import schema from '~/schema'
import Chargebee from 'chargebee';

if (!process.env.CB_SITE) {
    throw new Error('CB_SITE variable not set')
}

if (!process.env.CB_API_KEY) {
    throw new Error('CB_API_KEY variable not set')
}

export const postgres = new Postgres<typeof schema>()

export const chargebee = new Chargebee({
    site: process.env.CB_SITE,
    apiKey: process.env.CB_API_KEY
})