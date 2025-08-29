import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: {
    allowedHosts: [
      "db.auto-scaling.shop",
      "45.128.98.95",
      "45.128.98.95:8006",
      "127.0.0.1:8001",
      "auto-scaling.space",
      "127.0.0.1:5783"
    ],
     proxy: {
       "/backend": {
         target: "http://127.0.0.1:8001",
         changeOrigin: true,
         secure: false, 
         rewrite: (path) => path.replace(/^\/backend/, ''),
       },
       "/bpbi": {
         target: "http://127.0.0.1:5873",
         changeOrigin: true,
         secure: false, 
         rewrite: (path) => path.replace(/^\/bpbi/, ''),
       }
     }
  }
});
