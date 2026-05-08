import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [react(), nodePolyfills({ include: ['buffer', 'fs'] })],
  resolve: {
    alias: {
      'style': path.resolve(__dirname, 'src/style'),
      'components': path.resolve(__dirname, 'src/components'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'icons': path.resolve(__dirname, 'src/icons'),
      'locales': path.resolve(__dirname, 'src/locales'),
      'torrentStates': path.resolve(__dirname, 'src/torrentStates.js'),
      'i18n': path.resolve(__dirname, 'src/i18n.js'),
    },
  },
  server: {
    open: true,
    proxy: {
      '^/(?!@vite|@react-refresh|src|node_modules)([^.]+)$': 'http://localhost:8090',
    },
  },
})
