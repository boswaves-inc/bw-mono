declare module "virtual:nats-router/server-build" {
    export const routes: { subject: string; key: string, module: import('./types').ModuleInfo; }[]
}