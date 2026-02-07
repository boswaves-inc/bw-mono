import '@boswaves-inc/dsvc'
import 'virtual:smtp/elements'


declare module "@boswaves-inc/dsvc" {
    interface DsvcLoadContext {
        smtp: import('./services/smtp').Smtp
        postgres: import('./services/postgres').Postgres
    }
}

declare module "virtual:smtp/elements" {
    export const element_map: { [key: string]: import('./components/types').ElementInfo }
    export const elements: { module: import('./components/types').ElementInfo; key: string; }[]
}