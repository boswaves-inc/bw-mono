import '@boswaves-inc/svc'

import { Postgres } from './services/postgres'

declare module "@boswaves-inc/svc" {
    interface DsvcLoadContext {
        postgres: Postgres
    }
}
