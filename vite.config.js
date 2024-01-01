import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1624, // 원하는 포트 번호로 변경
  },
    base: './',
});
