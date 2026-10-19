import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
// import topLevelAwait from 'vite-plugin-top-level-await';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    // topLevelAwait() — disabled: Vite 5 supports native top-level await with target:esnext
    nodePolyfills({ include: ['buffer', 'events', 'stream', 'util'] })
  ],
  build: { target: 'esnext' },
  server: { port: 3000, host: true },
  assetsInclude: ['**/*.wasm'],
  resolve: {
    alias: {
      '@': '/src',
      '@sdk': '/../sdk'
    }
  }
});