import '@boswaves-inc/svc'

import { Postgres } from './services/postgres'

declare module "@boswaves-inc/svc" {
    interface SvcLoadContext {
        postgres: Postgres
    }
}
