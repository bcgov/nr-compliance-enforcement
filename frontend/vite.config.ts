import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import packageJson from "./package.json";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: "build-html",
      apply: "build",
      transformIndexHtml: (html) => {
        return {
          html,
          tags: [
            {
              tag: "script",
              attrs: {
                src: "/config.js",
              },
              injectTo: "head",
            },
          ],
        };
      },
    },
    {
      name: "update-manifest-version", // Custom plugin to update the manifest version
      apply: "build",
      writeBundle() {
        const manifestPath = path.resolve(__dirname, "dist/manifest.json");

        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

        // If the version property doesn't exist, initialize it
        if (!manifest.version) {
          manifest.version = `${packageJson.version}.${Date.now()}`;
        } else {
          // If the version exists, just update it
          manifest.version = `${packageJson.version}.${Date.now()}`;
        }
        // Write the updated version back to the manifest file
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      },
    },
  ],
  server: {
    host: "0.0.0.0", // This fixes the "use --host to expose" issue
    port: 3000,
    open: false, // This fixes the xdg-open error
  },
  build: {
    // Build Target
    // https://vitejs.dev/config/build-options.html#build-target
    target: "esnext",
    // Minify option
    // https://vitejs.dev/config/build-options.html#build-minify
    minify: "esbuild",
    // Rollup Options
    // https://vitejs.dev/config/build-options.html#build-rollupoptions
    rollupOptions: {
      output: {
        manualChunks: {
          // Split external library from transpiled code.
          react: ["react", "react-dom"],
          axios: ["axios"],
        },
      },
    },
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
      "@graphql": path.resolve(__dirname, "./src/app/graphql/"),
    },
  },
});
