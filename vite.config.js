import { fileURLToPath, URL } from 'node:url';

// Vite
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// PrimeVue
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    noDiscovery: true,
  },
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
