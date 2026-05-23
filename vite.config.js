import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Silakan ganti angka 3000 ini dengan port berapapun yang kamu mau
    strictPort: true, // Vite akan berhenti jika port ini sudah dipakai (tidak akan melompat ke port lain secara acak)
  },
});