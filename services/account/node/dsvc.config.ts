import { defineConfig } from "@boswaves-inc/dsvc/config";

export default defineConfig({
    namespace: 'account',
    routes: './src',
    output: '../sdk/src',
})