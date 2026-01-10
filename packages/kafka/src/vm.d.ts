declare module "virtual:kafka-router/server-build" {
    export const routes: { topic: string; module: import('./types').ModuleInfo; }[]
}