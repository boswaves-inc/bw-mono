// vite.config.ts
import path from 'path'
import { defineConfig } from 'vite';
import { natsRouterPlugin } from '@boswaves-inc/nats-router/dev/vite';
import { elementsPlugin } from './src/vite/elements'

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
            // 'lodash': 'lodash',
            // '~/schema/utils': path.resolve(__dirname, './schema/utils.ts'),
            '~/schema': path.resolve(__dirname, './src/schema/'),
            '~': path.resolve(__dirname, './src'),
        }
    },
    plugins: [
        elementsPlugin({
            input: './src/components'
        }),
        natsRouterPlugin(),
        tsconfigPaths()
    ],
});