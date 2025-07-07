import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets/"),
      "@common": path.resolve(__dirname, "./src/app/common/"),
      "@components": path.resolve(__dirname, "./src/app/components/"),
      "@constants": path.resolve(__dirname, "./src/app/constants/"),
      "@hooks": path.resolve(__dirname, "./src/app/hooks/"),
      "@providers": path.resolve(__dirname, "./src/app/providers/"),
      "@service": path.resolve(__dirname, "./src/app/service/"),
      "@store": path.resolve(__dirname, "./src/app/store/"),
      "@apptypes": path.resolve(__dirname, "./src/app/types/"),
    },
  },
});
