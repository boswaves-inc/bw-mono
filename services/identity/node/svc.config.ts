import { defineConfig } from "@boswaves-inc/svc/config";

export default defineConfig({
    namespace: 'identity',
    output: '../sdk/src',
    routes: './src'
});
