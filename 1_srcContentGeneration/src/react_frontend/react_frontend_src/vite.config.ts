import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_APP_PORT) || 3000,
      host: true,
      strictPort: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('error', (err) => console.log('Proxy Error:', err));
            proxy.on('proxyReq', (proxyReq, req) => console.log('Request:', req.method, req.url));
            proxy.on('proxyRes', (proxyRes, req) => console.log('Response:', proxyRes.statusCode, req.url));
          }
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            zustand: ['zustand']
          }
        }
      }
    },
    preview: {
      port: parseInt(env.VITE_APP_PORT) || 3000,
      host: true
    }
  };
}); 