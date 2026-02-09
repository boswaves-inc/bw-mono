import { defineConfig } from "@boswaves-inc/svc/config";

export default defineConfig({
    namespace: 'account',
    output: '../sdk/src',
    routes: './src'
});
