import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';

export default defineConfig(({ isSsrBuild }) => ({
  server: {
    allowedHosts: [
      "seaszn.ngrok.dev",
    ]
  },
  build: {
    outDir: 'dist',
    rollupOptions: isSsrBuild ? {
      external: ['async_hooks'],
      input: "./server/index.ts"
    } : undefined,
  },
  optimizeDeps: {
    exclude: ["virtual:react-router/server-build"],
  },
  resolve: {
    alias: {
      'lodash': 'lodash-es',
      '~': path.resolve(__dirname, './app')
    }
  },
  ssr: {
    noExternal: ['@boswaves-inc/smtp-sdk']
  }, 
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths()
  ],
}));
