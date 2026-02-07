
declare module "virtual:nats-router/server-build" {
    export const routes: { subject: string; key: string, module: import('./types').ModuleInfo; }[];
    export const config: import('./types').NatsConfig;
}