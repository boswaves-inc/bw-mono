// vite.config.ts
import path from 'path'
import { defineConfig } from 'vite';
import { elementsPlugin } from './src/vite'
import { natsRouterPlugin } from '@boswaves-inc/nats-router/vite';

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
            '~/schema': path.resolve(__dirname, './src/schema/'),
            '~': path.resolve(__dirname, './src'),
        }
    },
    plugins: [
        tsconfigPaths(),
        elementsPlugin({
            input: './src/components'
        }),
        natsRouterPlugin(),
    ],
});