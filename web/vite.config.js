import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), nodePolyfills({ include: ['buffer', 'fs'] }), tsconfigPaths()],
  server: {
    open: true,
    proxy: {
      '^/(?!@|src/|node_modules/)([^.]+)$': 'http://localhost:8090',
    },
  },
})
