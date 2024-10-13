import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
  },
  proxy: {
    "/khalti": {
      target: "https://esewa-int-backend.vercel.app/",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/khalti/, ""),
    },
  },
});
