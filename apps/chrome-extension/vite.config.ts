import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/content-script.tsx"),
      formats: ["iife"],
      name: "JSONCrackContentScript",
      fileName: () => "content-script.js",
    },
    cssCodeSplit: false,
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      output: {
        banner:
          "var Worker = undefined; var process = globalThis.process || (globalThis.process = { env: { NODE_ENV: 'production' } });",
      },
    },
  },
});
