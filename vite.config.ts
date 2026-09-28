import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Bind to every local interface (IPv4 + IPv6).
    // Using 'localhost' alone binds to IPv6 only, which makes http://127.0.0.1:5173
    // (and some browsers) fail. This also lets you preview on your phone using
    // your PC's LAN IP — handy for checking the mobile layout.
    host: true
  }
})