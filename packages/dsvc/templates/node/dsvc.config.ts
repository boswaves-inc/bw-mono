import { defineConfig } from "@boswaves-inc/dsvc/config";

export default defineConfig({
    namespace: 'smtp',
    routes: './src',
    sdk: {
        name: 'Smtp',
        out: '../sdk/src',
        pkg: '@boswaves-inc/smtp-sdk',
    }
})