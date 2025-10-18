import { Postgres } from 'drizzle'
import schema from '~/schema'

export const postgres = new Postgres<typeof schema>()