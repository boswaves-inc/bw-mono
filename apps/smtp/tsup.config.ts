import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    target: 'node18',
    clean: true,
    outExtension() {
        return { js: '.js' }
    },
    esbuildOptions(options) {
        options.jsx = 'automatic'
    },
    noExternal: ['@boswaves/core'],
})