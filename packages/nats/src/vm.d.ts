declare module "virtual:nats-router/server-build" {
    export const routes: { topic: string; module: import('./types').ModuleInfo; }[]
}