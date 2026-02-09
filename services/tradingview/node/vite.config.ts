import path from 'path'
import { defineConfig } from 'vite';
import { dsvcPlugin } from '@boswaves-inc/dsvc/vite';

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
            '~': path.resolve(__dirname, './src'),
        }
    },
    plugins: [
        tsconfigPaths(),
        dsvcPlugin(),
    ],
});