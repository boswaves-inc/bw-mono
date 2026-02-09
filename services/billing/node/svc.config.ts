import { defineConfig } from "@boswaves-inc/svc/config";

export default defineConfig({
    namespace: 'billing',
    output: '../sdk/src',
    routes: './src'
});
