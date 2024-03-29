import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  //   base: "/metronic8/vue/demo1/",

  base: "/tp-center/",
//   base: "/",
  build: {
    chunkSizeWarningLimit: 3000,
  },
});
