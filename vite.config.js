import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), topLevelAwait(), tailwindcss()],
  base: "./",
});
