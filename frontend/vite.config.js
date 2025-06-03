// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),tailwindcss()],
  

 
  server: {
    
    port: 3000,
    host: '192.168.1.200', 
    open: true,
    proxy: {
      '/titiler': {
        target: 'http://192.168.1.200:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/titiler/, ''),
      },
    }
    
    
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: true
  }
});





