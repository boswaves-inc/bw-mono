
declare module "virtual:svc/server-build" {
    export const routes: { subject: string; key: string, module: import('./types').ModuleInfo; }[];
    export const config: import('./types').DsvcConfig;
}