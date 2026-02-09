import '@boswaves-inc/svc'

import schema from '~/schema'
import { Postgres } from '@boswaves-inc/postgres'

declare module "@boswaves-inc/svc" {
    interface SvcLoadContext {
        postgres: Postgres<typeof schema>
    }
}