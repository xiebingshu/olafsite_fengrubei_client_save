import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server:{
    proxy:{
      '/path':{
        target:'http://127.0.0.1:8000/',
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/path/,'')
      }
    }
  }
})


