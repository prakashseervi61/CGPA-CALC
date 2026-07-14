import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Build settings - using defaults (output to 'dist' directory)
  build: {
    // Optional: you can customize build settings here
    // outDir: 'dist', // Default
    // sourcemap: false,
  },
});