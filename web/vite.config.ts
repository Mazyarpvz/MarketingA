import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: 'localhost',
    fs: {
      // Allow serving files from the project root and node_modules
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '../node_modules'),
      ],
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    proxy: {
      '/api': {
        // Follow backend port from env when overridden (fallback 3002)
        target: `http://localhost:${process.env.BACKEND_PORT || process.env.PORT || 3001}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../dist/web',
  },
})
