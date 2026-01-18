declare module "virtual:nats-router/server-build" {
    export const routes: { subject: string; module: import('./types').ModuleInfo; }[]
}