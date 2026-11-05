import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import poemsIndex from './scripts/poemsIndex.js'
import pageMeta from './scripts/pageMeta.js'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',
  },
  plugins: [react(), poemsIndex(), pageMeta()],
})
