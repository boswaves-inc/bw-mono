import { defineConfig } from "@boswaves-inc/dsvc/config";

export default defineConfig({
    namespace: 'smtp',
    routes: './src',
    output: '../sdk/src',
})