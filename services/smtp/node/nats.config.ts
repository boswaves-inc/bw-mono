import { defineConfig } from "@boswaves-inc/nats-router/config";

export default defineConfig({
    namespace: 'smtp',
    routes: './src',
    sdk: {
        out: '../sdk/src',
        factory: ({ route }) => {

        }
        // factory: ({ routes }) => {
        //     console.log('test')
        // }
    }
})