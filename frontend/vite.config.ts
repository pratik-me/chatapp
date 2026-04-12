import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@prisma/db-types': path.resolve(__dirname, "../generated/prisma/client.ts")
    }
  }
})
