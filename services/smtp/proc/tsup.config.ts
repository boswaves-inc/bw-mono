import { defineConfig } from 'tsup'

const env = process.env.NODE_ENV;

export default defineConfig({
    clean: true,
    outDir: 'dist',
    format: [ 'esm'], // generate cjs and esm files
    target: 'es2020',
    entry: [
        'src/index.ts',
        'src/root.css',
    ],
    minify: env === 'production',
    outExtension() {
        return { js: '.js', css: '.css' }
    },
    esbuildOptions(options) {
        options.jsx = 'automatic'
    },
})