import { Postgres } from '~/libs/postgres'
import schema from '~/schema'

export const postgres = new Postgres<typeof schema>()