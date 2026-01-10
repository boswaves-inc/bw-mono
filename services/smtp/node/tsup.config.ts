// import { readdirSync } from 'fs';
// import { join } from 'path';
// import { defineConfig } from 'tsup'

// const env = process.env.NODE_ENV;

// // const routes = readdirSync(join(__dirname, 'src/routes'))
// //   .filter(f => /\.(ts|tsx|js|jsx)$/.test(f) && !f.startsWith('_'))
// //   .map(f => `src/routes/${f}`);

// // const blocks = readdirSync(join(__dirname, 'src/elements'))
// //   .filter(f => /\.(ts|tsx|js|jsx)$/.test(f) && !f.startsWith('_'))
// //   .map(f => `src/elements/${f}`);

// export default defineConfig({
//   clean: true,
//   outDir: 'dist',
//   format: ['esm'], // generate cjs and esm files
//   target: 'es2020',
//   entry: [
//     'src/index.ts',
//     // ...routes,
//     // ...blocks,
//   ],
//   esbuildPlugins: [
//     kafkaRouterPlugin()
//   ],
//   minify: env === 'production',
//   noExternal: [
//     'lodash'
//   ],
//   outExtension() {
//     return { js: '.js', css: '.css' }
//   },
//   esbuildOptions(options) {
//     options.jsx = 'automatic'
//   },
// })