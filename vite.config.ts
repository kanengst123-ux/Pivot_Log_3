import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Explicitly set output directory for clarity
  },
  define: {
    // Fallback to empty string if undefined to prevent build crashes
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});