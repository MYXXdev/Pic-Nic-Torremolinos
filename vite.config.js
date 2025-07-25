import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Pic-Nic-Torremolinos/', // Adjust if using relative base './'
});
