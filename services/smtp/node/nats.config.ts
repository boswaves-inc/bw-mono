import { defineConfig } from "@boswaves-inc/nats-router/config";

export default defineConfig({
    namespace: 'smtp',
    routes: './src',
})