import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'aiida-react-components-base': path.resolve(__dirname, '../src')
    }
  }
});
