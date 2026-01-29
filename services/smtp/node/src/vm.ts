declare module "virtual:smtp/elements" {
    export const element_map: { [key: string]: import('./components/types').ElementInfo }

    export const elements: { module: import('./components/types').ElementInfo; key: string; }[]
    // export const elements: typeof import('../+runtime').elements
}