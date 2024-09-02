import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),nodePolyfills({
    // Whether to polyfill `node:` protocol imports.
    exclude : []
  }),],
  resolve: {
    alias: {
      // Ensure that you install 'rollup-plugin-polyfill-node' package
      'events': 'rollup-plugin-node-polyfills/polyfills/events',
    }
},

  server:{
    proxy:{
      '/backend':
      {
        target:'http://localhost:3000',
        changeOrigin:true,
        secure:false
      },
    }
  },
  define: {
    global: {}}, 
})
