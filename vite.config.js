import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `base: './'` makes asset URLs relative, so the build works on any
// GitHub Pages path (e.g. /FollowUp/) without hardcoding the repo name.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
