import '@boswaves-inc/dsvc'

import { Postgres } from './services/postgres'

declare module "@boswaves-inc/dsvc" {
    interface DsvcLoadContext {
        postgres: Postgres
    }
}
