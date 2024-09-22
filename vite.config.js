import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: '/Koi-Auction-FE/', // Replace with your repository name
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    port: 3000,
  },
});
