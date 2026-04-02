import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      global: 'globalThis',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    server: {
      port: env.VITE_PORT,
      proxy: {
        // WebSocket — bypass the gateway and go directly to Notification-Service.
        // The gateway's WS proxying is unreliable in local dev.
        // Rewrite strips /notifications so Spring Boot receives the path it registered: /ws
        // Browser: localhost:VITE_PORT/notifications/ws/** → localhost:2530/ws/**
        '/notifications/ws': {
          target: env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:2530',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/notifications/, ''),
        },
      },
    },
  };
});
