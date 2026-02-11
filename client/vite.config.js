import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // Adicione isso para SPA
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8800",
        changeOrigin: true,
        secure: false,
        // Se o backend NÃO espera o prefixo /api, descomente a linha rewrite:
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
