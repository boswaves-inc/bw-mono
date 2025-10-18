import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild ? { input: "./server/index.ts" } : undefined,
  },
  optimizeDeps: {
    exclude: ["virtual:react-router/server-build"],
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths()
  ],
}));
