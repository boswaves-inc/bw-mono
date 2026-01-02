
import "react-router";

declare module "react-router" {
    interface AppLoadContext {
        theme: 'dark' | 'light';
    }
}

export type Theme = 'dark' | 'light'