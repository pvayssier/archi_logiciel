import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: path.resolve(__dirname), // ← important
  plugins: [react()],
  build: {
    outDir: "../dist/ui",
  },
});
