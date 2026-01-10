// vite.config.ts
import path from 'path'
import { defineConfig } from 'vite';
import { kafkaRouterPlugin } from '@boswaves-inc/kafka-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    build: {
        ssr: true,
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
        },
    },
    resolve: {
        alias: {
            'lodash': 'lodash-es',
            // '~/schema/utils': path.resolve(__dirname, './schema/utils.ts'),
            '~/schema': path.resolve(__dirname, './src/schema/'),
            '~': path.resolve(__dirname, './src'),
        }
    },
    plugins: [
        kafkaRouterPlugin(),
        tsconfigPaths()

    ],
});