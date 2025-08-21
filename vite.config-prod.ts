import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: {
    allowedHosts: [
      "127.0.0.1:8001",
      "pegasus.ct-interactive.com",
      "45.128.98.94",
    ],
     proxy: {
       "/backend": {
         target: "http://127.0.0.1:8001",
         changeOrigin: true,
         secure: false, 
         rewrite: (path) => path.replace(/^\/backend/, ''),
       }
     }
  }
});
