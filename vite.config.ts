import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Limit the number of worker threads to avoid resource exhaustion
    minify: "esbuild",
    target: "esnext",
  },
  optimizeDeps: {
    // Force esbuild for dependency optimization
    esbuildOptions: {
      target: "esnext",
    },
  },
  // Limit worker threads
  worker: {
    format: "es",
  },
});
