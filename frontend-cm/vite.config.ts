import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      {
        name: 'build-html',
        apply: 'build',
        transformIndexHtml: (html) => {
          return {
            html,
            tags: [
              {
                tag: 'script',
                attrs: {
                  src: '/config.js',
                },
                injectTo: 'head',
              },
            ],
          }
        },
      },
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
    ],
    server: {
      port: parseInt(env.VITE_PORT) ?? 3000,
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
      },
      proxy: {
        // Proxy API requests to the backend
        '/api': {
          target: env.VITE_BASE_URL ?? 'http://localhost:3003',
          changeOrigin: true,
        },
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      cors: true,
    },
    resolve: {
      // https://vitejs.dev/config/shared-options.html#resolve-alias
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
        '~bootstrap': fileURLToPath(
          new URL('./node_modules/bootstrap', import.meta.url),
        ),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    build: {
      // Build Target
      // https://vitejs.dev/config/build-options.html#build-target
      target: 'esnext',
      // Minify option
      // https://vitejs.dev/config/build-options.html#build-minify
      minify: 'esbuild',
      // Rollup Options
      // https://vitejs.dev/config/build-options.html#build-rollupoptions
      rollupOptions: {
        output: {
          manualChunks: {
            // Split external library from transpiled code.
            react: ['react', 'react-dom'],
            axios: ['axios'],
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Silence deprecation warnings caused by Bootstrap SCSS
          // which is out of our control.
          silenceDeprecations: [
            'mixed-decls',
            'color-functions',
            'global-builtin',
            'import',
          ],
        },
      },
    },
  }
})
