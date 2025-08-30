import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy API calls to Flask backend - KEEP the /api prefix
      "/api": {
        target: "http://127.0.0.1:5000", // Use 127.0.0.1 since that's what works
        changeOrigin: true,
        secure: false,
        // DON'T rewrite - keep the /api prefix since Flask expects it
        // configure: (proxy, _options) => {
        //   proxy.on("error", (err, _req, _res) => {
        //     console.log("🔴 Proxy error:", err)
        //   })
        //   proxy.on("proxyReq", (proxyReq, req, _res) => {
        //     console.log("📡 Proxying request:", req.method, req.url, "-> target:", proxyReq.path)
        //   })
        //   proxy.on("proxyRes", (proxyRes, req, _res) => {
        //     console.log("📨 Proxy response:", proxyRes.statusCode, req.url)
        //   })
        // },
      },
      // Also proxy health endpoint for debugging
      "/health": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
})
