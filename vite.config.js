import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // console.log(env); 

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: env.VITE_PORT,
    },
  };
});
