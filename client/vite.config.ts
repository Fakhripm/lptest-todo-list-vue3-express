import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // 自动导入 Element Plus 的API
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // 自动解析、导入组件+样式
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // 添加 server 配置以允许 cpolar 穿透访问
  server: {
    host: true, // 监听所有 IP 地址（包括局域网 IP）
    allowedHosts: true, // 允许所有域名访问，解决 Blocked host 报错
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:color";
          @use "@/assets/styles/variables.scss" as *;
          @use "@/assets/styles/mixins.scss" as *;
        `,
      },
    },
  },
})
