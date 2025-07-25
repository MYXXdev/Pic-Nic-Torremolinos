import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Because we will deploy with GitHub Actions to Pages and (optionally) a custom domain,
// we can safely use '/' as base to avoid the white-page/base-path hell.
export default defineConfig({
  plugins: [react()],
  base: '/',
});