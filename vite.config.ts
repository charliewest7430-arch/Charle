impo# 1. Remove bun.lock from git tracking and disk
git rm -f bun.lock

# 2. Stage the verified package.json, package-lock.json, and public/_redirects
git add package.json package-lock.json public/_redirects

# 3. Commit the changes
git commit -m "fix(deploy): remove bun.lock and use npm package-lock.json"

# 4. Push to your GitHub branch
git push origin mainrt tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
