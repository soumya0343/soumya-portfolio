import { defineConfig, loadEnv, type PluginOption, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Runs the /api/ask serverless function locally during `npm run dev`
// (in production Vercel serves api/ask.ts directly).
function apiDevServer(): PluginOption {
  return {
    name: 'api-dev-server',
    config(_, { mode }) {
      // Bridge non-VITE_ vars (LLM_API_KEY, etc.) from .env into process.env so the
      // dev handler can read them — Vite only exposes VITE_-prefixed vars by default.
      const env = loadEnv(mode, process.cwd(), '')
      for (const key of Object.keys(env)) {
        if (key.startsWith('LLM_') && !process.env[key]) process.env[key] = env[key]
      }
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/ask', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/ask.ts')
          await mod.default(req, res)
        } catch (err) {
          server.config.logger.error(`[api/ask] ${String(err)}`)
          if (!res.headersSent) res.statusCode = 500
          res.end('Dev API error — see terminal.')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    apiDevServer(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
